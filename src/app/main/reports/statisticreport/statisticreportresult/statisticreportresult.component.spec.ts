import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticreportresultComponent } from './statisticreportresult.component';

describe('StatisticreportresultComponent', () => {
  let component: StatisticreportresultComponent;
  let fixture: ComponentFixture<StatisticreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
