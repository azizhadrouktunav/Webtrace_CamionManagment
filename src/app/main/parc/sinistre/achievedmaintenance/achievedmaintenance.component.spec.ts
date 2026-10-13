import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievedmaintenanceComponent } from './achievedmaintenance.component';

describe('AchievedmaintenanceComponent', () => {
  let component: AchievedmaintenanceComponent;
  let fixture: ComponentFixture<AchievedmaintenanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AchievedmaintenanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievedmaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
