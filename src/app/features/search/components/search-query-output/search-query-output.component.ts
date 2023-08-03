import { Component, OnInit } from '@angular/core';
import { ErrorService } from 'src/app/core/services/error.service';
import { SearchApiService } from 'src/app/core/services/search-api.service';

@Component({
  selector: 'app-search-query-output',
  templateUrl: './search-query-output.component.html',
  styleUrls: ['./search-query-output.component.css'],
})
export class SearchQueryOutputComponent implements OnInit {
  $outputSearch!: any;
  outputSearchText: string = "";
  constructor(
    private searchApiService: SearchApiService,
    private errorService: ErrorService
  ) {}
  ngOnInit(): void {
    this.$outputSearch = this.searchApiService.$outputSearchSuccess.subscribe({
      next: (data: any) => {
        this.outputSearchText = (data as string);
      },
      error: (err: Error) => {
        this.errorService.handleError(err, 'Search Output Failed');
      },
    });
  }

  shouldShowOutputSearch(): boolean {
    if (
      this.outputSearchText !== null &&
      this.outputSearchText !== undefined && 
      this.outputSearchText !== "" 
    ) {
      return true;
    }
    return false;
  }

  ngOnDestroy(): void {
    if (this.$outputSearch) {
      this.$outputSearch.unsubscribe();
    }
  }
}
