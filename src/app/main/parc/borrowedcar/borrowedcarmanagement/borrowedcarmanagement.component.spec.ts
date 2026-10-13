import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedcarmanagementComponent } from './borrowedcarmanagement.component';

describe('BorrowedcarmanagementComponent', () => {
  let component: BorrowedcarmanagementComponent;
  let fixture: ComponentFixture<BorrowedcarmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowedcarmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowedcarmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
