import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankMonitorComponent } from './tank-monitor.component';

describe('TankMonitorComponent', () => {
  let component: TankMonitorComponent;
  let fixture: ComponentFixture<TankMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
