import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchQueryMainComponent } from './features/search/components/search-query-main/search-query-main.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchQueryMainComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
