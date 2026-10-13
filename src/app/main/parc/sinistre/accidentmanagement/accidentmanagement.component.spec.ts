import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentmanagementComponent } from './accidentmanagement.component';

describe('AccidentmanagementComponent', () => {
  let component: AccidentmanagementComponent;
  let fixture: ComponentFixture<AccidentmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
