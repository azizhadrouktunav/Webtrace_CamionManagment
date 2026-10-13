import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectCouponFormComponent } from './affect-coupon-form.component';

describe('AffectCouponFormComponent', () => {
  let component: AffectCouponFormComponent;
  let fixture: ComponentFixture<AffectCouponFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AffectCouponFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AffectCouponFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
