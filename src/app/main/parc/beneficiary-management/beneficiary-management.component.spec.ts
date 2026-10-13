import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiaryManagementComponent } from './beneficiary-management.component';

describe('BeneficiaryManagementComponent', () => {
  let component: BeneficiaryManagementComponent;
  let fixture: ComponentFixture<BeneficiaryManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficiaryManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficiaryManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
