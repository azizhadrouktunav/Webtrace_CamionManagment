import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyStatusDialogComponent } from './verify-status-dialog.component';

describe('VerifyStatusDialogComponent', () => {
  let component: VerifyStatusDialogComponent;
  let fixture: ComponentFixture<VerifyStatusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyStatusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
