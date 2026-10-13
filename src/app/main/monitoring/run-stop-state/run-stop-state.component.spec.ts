import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunStopStateComponent } from './run-stop-state.component';

describe('RunStopStateComponent', () => {
  let component: RunStopStateComponent;
  let fixture: ComponentFixture<RunStopStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunStopStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunStopStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
