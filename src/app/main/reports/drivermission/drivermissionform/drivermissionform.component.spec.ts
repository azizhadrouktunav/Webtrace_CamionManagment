import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivermissionformComponent } from './drivermissionform.component';

describe('DrivermissionformComponent', () => {
  let component: DrivermissionformComponent;
  let fixture: ComponentFixture<DrivermissionformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivermissionformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivermissionformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
