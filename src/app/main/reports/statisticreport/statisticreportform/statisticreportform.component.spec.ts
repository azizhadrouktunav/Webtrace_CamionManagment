import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticreportformComponent } from './statisticreportform.component';

describe('StatisticreportformComponent', () => {
  let component: StatisticreportformComponent;
  let fixture: ComponentFixture<StatisticreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
