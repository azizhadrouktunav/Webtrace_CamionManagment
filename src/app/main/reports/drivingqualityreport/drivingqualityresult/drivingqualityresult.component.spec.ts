import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingqualityresultComponent } from './drivingqualityresult.component';

describe('DrivingqualityresultComponent', () => {
  let component: DrivingqualityresultComponent;
  let fixture: ComponentFixture<DrivingqualityresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivingqualityresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingqualityresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
