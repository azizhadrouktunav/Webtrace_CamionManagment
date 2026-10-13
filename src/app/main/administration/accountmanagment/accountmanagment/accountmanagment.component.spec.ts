import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountmanagmentComponent } from './accountmanagment.component';

describe('AccountmanagmentComponent', () => {
  let component: AccountmanagmentComponent;
  let fixture: ComponentFixture<AccountmanagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountmanagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountmanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
