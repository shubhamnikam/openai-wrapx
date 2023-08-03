import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICommonOutputModel } from 'src/app/core/models/ICommonOutputModel';
import { IModuleConfig } from 'src/app/core/models/IModuleConfig';
import { ISearchInputModel } from 'src/app/core/models/ISearchInputModel';
import { ErrorService } from 'src/app/core/services/error.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RateLimiterService } from 'src/app/core/services/rate-limiter.service';
import { SearchApiService } from 'src/app/core/services/search-api.service';
import { StorageService } from 'src/app/core/services/storage.service';
import { AppConstants } from 'src/app/core/utilities/AppConstants';


@Component({
  selector: 'app-search-query-input',
  templateUrl: './search-query-input.component.html',
  styleUrls: ['./search-query-input.component.css'],
})
export class SearchQueryInputComponent implements OnInit, OnDestroy {
  searchQueryInputForm!: FormGroup;
  $getModuleConfig!: any;
  $submitSearch!: any;
  moduleConfigs!: IModuleConfig[];
  filteredFeature!: string[];
  randomCount = 0;
  searchDescPlaceholder = "Enter search description..."

  constructor(
    private fb: FormBuilder,
    private searchApiHelper: SearchApiService,
    private errorService: ErrorService,
    private storageService: StorageService,
    private notifyService: NotifyService,
    private rateLimiterService: RateLimiterService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getRandomSearchDescPlaceHolder();
    if (this.rateLimiterService.handleRateLimiterSession(true)) {
      this.getModuleConfigs();
    }
  }

  getModuleConfigs(): void {
    this.$getModuleConfig = this.searchApiHelper.getModuleConfig().subscribe({
      next: (result: IModuleConfig[]) => {
        this.moduleConfigs = result;
        this.storageService.setToLocalStorage(
          AppConstants.CACHE_KEY_ALL_CONFIG,
          this.moduleConfigs
        );
        this.notifyService.notifySuccess('Get Config', 'Success');
      },
      error: (err: Error) => {
        this.errorService.handleError(err, 'Get Config Failed');
      },
    });
  }

  initForm(): void {
    this.searchQueryInputForm = this.fb.group({
      moduleOptions: ['default', [Validators.required]],
      featureOptions: ['default', [Validators.required]],
      inputSearchText: ['', [Validators.required]],
    });
  }

  onChangeModuleSelect(event: any): void {
    this.getFeatureListByModuleId(event.target.value);
  }

  shouldDisableFeatureOptions(): boolean {
    const selectedModule =
      this.searchQueryInputForm.get('moduleOptions')?.value;

    if (selectedModule && selectedModule !== 'default') {
      return false;
    }
    return true;
  }
  shouldDisableInputSearchText(): boolean {
    const selectedModule =
      this.searchQueryInputForm.get('moduleOptions')?.value;
    const selectedFeature =
      this.searchQueryInputForm.get('featureOptions')?.value;
    if (
      selectedModule &&
      selectedFeature &&
      selectedModule !== 'default' &&
      selectedFeature !== 'default'
    ) {
      return false;
    }
    return true;
  }
  shouldDisableSearchButton(): boolean {
    const selectedModule =
      this.searchQueryInputForm.get('moduleOptions')?.value;
    const selectedFeature =
      this.searchQueryInputForm.get('featureOptions')?.value;
    const inputSearchText =
      this.searchQueryInputForm.get('inputSearchText')?.value;
    if (
      selectedModule &&
      selectedFeature &&
      inputSearchText &&
      selectedModule !== 'default' &&
      selectedFeature !== 'default' &&
      inputSearchText !== 'default'
    ) {
      return false;
    }

    this.searchApiHelper.publishOutputSearchSuccess('');
    return true;
  }

  getFeatureListByModuleId(moduleId: number): void {
    this.filteredFeature = [];
    this.moduleConfigs.forEach((item) => {
      if (item.id === +moduleId) {
        this.filteredFeature.push(...item.features);
      }
    });
  }

  getRandomSearchDescPlaceHolder(): string {
    if (this.randomCount == 0) {
      ++this.randomCount;
      const random = Math.floor(
        Math.random() * AppConstants.SEARCH_PLACEHOLDER_DESC.length
      );
      return (
        this.searchDescPlaceholder = AppConstants.SEARCH_PLACEHOLDER_DESC.at(random) ?? 'Enter Search Description'
      );
    }
    return 'Enter Search Description';
  }

  submitSearchQueryForm(): void {
    
    if (!this.rateLimiterService.handleRateLimiterSession()) {
      return;
    }
    if (!this.searchQueryInputForm.valid) {
      return;
    }

    this.searchApiHelper.publishOutputSearchSuccess('');

    const moduleOptionsElement = document.getElementById(
      'moduleOptions'
    ) as HTMLSelectElement;
    const featureOptionsElement = document.getElementById(
      'featureOptions'
    ) as HTMLSelectElement;

    const searchInputModel: ISearchInputModel = {
      moduleName:
        moduleOptionsElement.options[moduleOptionsElement.selectedIndex].text,
      featureName:
        featureOptionsElement.options[featureOptionsElement.selectedIndex].text,
      searchText: this.searchQueryInputForm.get('inputSearchText')?.value,
    };

    this.$submitSearch = this.searchApiHelper
      .submitSearch(searchInputModel)
      .subscribe({
        next: (result: string) => {
          if (result) {
            // publish event
            this.searchApiHelper.publishOutputSearchSuccess(result);
            // notify
            this.notifyService.notifySuccess('Get Search', 'Success');
          } else {
            this.errorService.handleError(
              new Error('Result empty'),
              'Get Search Failed'
            );
          }
        },
        error: (err: Error) => {
          this.errorService.handleError(err, 'Get Search Failed');
        },
      });
  }

  ngOnDestroy(): void {
    if (this.$getModuleConfig) {
      this.$getModuleConfig.unsubscribe();
    }
    if (this.$submitSearch) {
      this.$submitSearch.unsubscribe();
    }
  }
}
