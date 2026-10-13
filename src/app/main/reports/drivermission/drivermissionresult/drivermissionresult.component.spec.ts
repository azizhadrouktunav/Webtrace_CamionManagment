import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivermissionresultComponent } from './drivermissionresult.component';

describe('DrivermissionresultComponent', () => {
  let component: DrivermissionresultComponent;
  let fixture: ComponentFixture<DrivermissionresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivermissionresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivermissionresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
