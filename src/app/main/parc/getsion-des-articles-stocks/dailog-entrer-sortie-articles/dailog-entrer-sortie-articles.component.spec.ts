import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailogEntrerSortieArticlesComponent } from './dailog-entrer-sortie-articles.component';

describe('DailogEntrerSortieArticlesComponent', () => {
  let component: DailogEntrerSortieArticlesComponent;
  let fixture: ComponentFixture<DailogEntrerSortieArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogEntrerSortieArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailogEntrerSortieArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
