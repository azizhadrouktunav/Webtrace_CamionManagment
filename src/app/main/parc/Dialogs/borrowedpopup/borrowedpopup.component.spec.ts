import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowedpopupComponent } from './borrowedpopup.component';

describe('BorrowedpopupComponent', () => {
  let component: BorrowedpopupComponent;
  let fixture: ComponentFixture<BorrowedpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowedpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowedpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
