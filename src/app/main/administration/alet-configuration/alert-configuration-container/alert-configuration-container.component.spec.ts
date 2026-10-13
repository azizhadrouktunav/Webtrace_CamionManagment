import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertConfigurationContainerComponent } from './alert-configuration-container.component';

describe('AlertConfigurationContainerComponent', () => {
  let component: AlertConfigurationContainerComponent;
  let fixture: ComponentFixture<AlertConfigurationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertConfigurationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertConfigurationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
