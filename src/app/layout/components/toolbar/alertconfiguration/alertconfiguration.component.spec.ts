import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertconfigurationComponent } from './alertconfiguration.component';

describe('AlertconfigurationComponent', () => {
  let component: AlertconfigurationComponent;
  let fixture: ComponentFixture<AlertconfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertconfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
