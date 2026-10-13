import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyreportresultComponent } from './monthlyreportresult.component';

describe('MonthlyreportresultComponent', () => {
  let component: MonthlyreportresultComponent;
  let fixture: ComponentFixture<MonthlyreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
