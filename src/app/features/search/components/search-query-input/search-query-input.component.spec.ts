import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchQueryInputComponent } from './search-query-input.component';

describe('SearchQueryInputComponent', () => {
  let component: SearchQueryInputComponent;
  let fixture: ComponentFixture<SearchQueryInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchQueryInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchQueryInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
