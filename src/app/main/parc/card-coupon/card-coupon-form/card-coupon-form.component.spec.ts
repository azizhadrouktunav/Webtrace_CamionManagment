import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCouponFormComponent } from './card-coupon-form.component';

describe('CardCouponFormComponent', () => {
  let component: CardCouponFormComponent;
  let fixture: ComponentFixture<CardCouponFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardCouponFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCouponFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
