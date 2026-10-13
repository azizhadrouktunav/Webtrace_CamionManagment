import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceFormComponent } from './geofence-form.component';

describe('GeofenceFormComponent', () => {
  let component: GeofenceFormComponent;
  let fixture: ComponentFixture<GeofenceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofenceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
