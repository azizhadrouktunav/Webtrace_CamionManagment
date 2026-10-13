import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsinworktimeresultComponent } from './statisticsinworktimeresult.component';

describe('StatisticsinworktimeresultComponent', () => {
  let component: StatisticsinworktimeresultComponent;
  let fixture: ComponentFixture<StatisticsinworktimeresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsinworktimeresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsinworktimeresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
