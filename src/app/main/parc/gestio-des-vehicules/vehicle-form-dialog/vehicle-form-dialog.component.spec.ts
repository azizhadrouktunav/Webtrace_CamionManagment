import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleFormDialogComponent } from './vehicle-form-dialog.component';

describe('VehicleFormDialogComponent', () => {
  let component: VehicleFormDialogComponent;
  let fixture: ComponentFixture<VehicleFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
