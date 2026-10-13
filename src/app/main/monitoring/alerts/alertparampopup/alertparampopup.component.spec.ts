import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertparampopupComponent } from './alertparampopup.component';

describe('AlertparampopupComponent', () => {
  let component: AlertparampopupComponent;
  let fixture: ComponentFixture<AlertparampopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertparampopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertparampopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
