import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelreportresultComponent } from './fuelreportresult.component';

describe('FuelreportresultComponent', () => {
  let component: FuelreportresultComponent;
  let fixture: ComponentFixture<FuelreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
