import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturereportformComponent } from './temperaturereportform.component';

describe('TemperaturereportformComponent', () => {
  let component: TemperaturereportformComponent;
  let fixture: ComponentFixture<TemperaturereportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturereportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturereportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
