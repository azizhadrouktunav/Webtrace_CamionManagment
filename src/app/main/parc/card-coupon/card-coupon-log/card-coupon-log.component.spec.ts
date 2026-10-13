import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCouponLogComponent } from './card-coupon-log.component';

describe('CardCouponLogComponent', () => {
  let component: CardCouponLogComponent;
  let fixture: ComponentFixture<CardCouponLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardCouponLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCouponLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
