import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewContactComponent } from './renew-contact.component';

describe('RenewContactComponent', () => {
  let component: RenewContactComponent;
  let fixture: ComponentFixture<RenewContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
