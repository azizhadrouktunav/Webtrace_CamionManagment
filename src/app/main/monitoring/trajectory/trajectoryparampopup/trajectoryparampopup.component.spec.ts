import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryparampopupComponent } from './trajectoryparampopup.component';

describe('TrajectoryparampopupComponent', () => {
  let component: TrajectoryparampopupComponent;
  let fixture: ComponentFixture<TrajectoryparampopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajectoryparampopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryparampopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
