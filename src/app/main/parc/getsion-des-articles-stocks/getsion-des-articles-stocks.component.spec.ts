import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetsionDesArticlesStocksComponent } from './getsion-des-articles-stocks.component';

describe('GetsionDesArticlesStocksComponent', () => {
  let component: GetsionDesArticlesStocksComponent;
  let fixture: ComponentFixture<GetsionDesArticlesStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetsionDesArticlesStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetsionDesArticlesStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
