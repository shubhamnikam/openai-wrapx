import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './core/interceptors/api.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchQueryMainComponent } from './features/search/components/search-query-main/search-query-main.component';
import { SearchQueryInputComponent } from './features/search/components/search-query-input/search-query-input.component';
import { SearchQueryOutputComponent } from './features/search/components/search-query-output/search-query-output.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AppConstants } from './core/utilities/AppConstants';
import { AnalyticsModule } from '@angular/fire/analytics';


@NgModule({
  declarations: [
    AppComponent,
    SearchQueryInputComponent,
    SearchQueryOutputComponent,
    SearchQueryMainComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      progressBar: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
      resetTimeoutOnDuplicate: true,
      newestOnTop: true,
      includeTitleDuplicates: true,
    }),
    provideFirebaseApp(() => initializeApp(AppConstants.getFirebaseConfig())),
    provideFirestore(() => getFirestore()),
    AnalyticsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
