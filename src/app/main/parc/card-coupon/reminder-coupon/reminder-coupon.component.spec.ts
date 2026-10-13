import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReminderCouponComponent } from './reminder-coupon.component';

describe('ReminderCouponComponent', () => {
  let component: ReminderCouponComponent;
  let fixture: ComponentFixture<ReminderCouponComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReminderCouponComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReminderCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
