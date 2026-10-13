import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunstopparampopupComponent } from './runstopparampopup.component';

describe('RunstopparampopupComponent', () => {
  let component: RunstopparampopupComponent;
  let fixture: ComponentFixture<RunstopparampopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunstopparampopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunstopparampopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
