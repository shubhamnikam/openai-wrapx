import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  from,
  map,
  Observable,
  throwError,
} from 'rxjs';
import { ICommonOutputModel } from '../models/ICommonOutputModel';
import { IModuleConfig } from '../models/IModuleConfig';
import { ISearchInputModel } from '../models/ISearchInputModel';
import { AppConstants } from '../utilities/AppConstants';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { OpenAIApi } from 'openai';
import { Configuration } from 'openai/dist/configuration';

@Injectable({
  providedIn: 'root',
})
export class SearchApiService {
  readonly openai = new OpenAIApi(
    new Configuration(AppConstants.getOpenAIConfig())
  );

  constructor(private httpClient: HttpClient, private firestore: Firestore) {}

  private outputSearchSuccess = new BehaviorSubject({});
  $outputSearchSuccess = this.outputSearchSuccess.asObservable();

  getModuleConfig(): Observable<IModuleConfig[]> {
    const moduleCollection = collection(
      this.firestore,
      AppConstants.FIREBASE_COLLECTION_MODULE
    );
    return collectionData(moduleCollection).pipe(
      catchError((error) => {
        return throwError(error);
      }),
      map((results) => {
        return (results as IModuleConfig[]).sort((a, b) => {
          return a.id - b.id;
        });
      })
    );
  }
  submitSearch(searchInputModel: ISearchInputModel): Observable<string> {
    return from(
      this.openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${searchInputModel.moduleName} for ${searchInputModel.featureName} and use following search description: '${searchInputModel.searchText}'`,
        max_tokens: 256,
      })
    ).pipe(
      catchError((error) => {
        return throwError(error);
      }),
      filter((resp) => !!resp && !!resp.data),
      map((resp) => resp.data),
      filter(
        (data: any) =>
          data.choices && data.choices.length > 0 && data.choices[0].text
      ),
      map((data) => data.choices[0].text?.trim())
    );
  }

  publishOutputSearchSuccess(data: string): void {
    this.outputSearchSuccess.next(data);
  }
}
