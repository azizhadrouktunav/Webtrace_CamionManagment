import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsinworktimeformComponent } from './statisticsinworktimeform.component';

describe('StatisticsinworktimeformComponent', () => {
  let component: StatisticsinworktimeformComponent;
  let fixture: ComponentFixture<StatisticsinworktimeformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsinworktimeformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsinworktimeformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
