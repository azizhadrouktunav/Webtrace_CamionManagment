import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelreportformComponent } from './fuelreportform.component';

describe('FuelreportformComponent', () => {
  let component: FuelreportformComponent;
  let fixture: ComponentFixture<FuelreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
