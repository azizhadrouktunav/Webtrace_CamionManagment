import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireLogByCarComponent } from './tire-log-by-car.component';

describe('TireLogByCarComponent', () => {
  let component: TireLogByCarComponent;
  let fixture: ComponentFixture<TireLogByCarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireLogByCarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireLogByCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
