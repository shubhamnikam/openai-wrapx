import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchQueryMainComponent } from './search-query-main.component';

describe('SearchQueryMainComponent', () => {
  let component: SearchQueryMainComponent;
  let fixture: ComponentFixture<SearchQueryMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchQueryMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchQueryMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
