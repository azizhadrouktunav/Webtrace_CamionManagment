import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentlogComponent } from './paymentlog.component';

describe('PaymentlogComponent', () => {
  let component: PaymentlogComponent;
  let fixture: ComponentFixture<PaymentlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
