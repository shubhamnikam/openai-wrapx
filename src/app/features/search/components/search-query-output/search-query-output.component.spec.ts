import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchQueryOutputComponent } from './search-query-output.component';

describe('SearchQueryOutputComponent', () => {
  let component: SearchQueryOutputComponent;
  let fixture: ComponentFixture<SearchQueryOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchQueryOutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchQueryOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
