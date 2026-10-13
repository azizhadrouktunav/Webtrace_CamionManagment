import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountpopupComponent } from './accountpopup.component';

describe('AccountpopupComponent', () => {
  let component: AccountpopupComponent;
  let fixture: ComponentFixture<AccountpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
