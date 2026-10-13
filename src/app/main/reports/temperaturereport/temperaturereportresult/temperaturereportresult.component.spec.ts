import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturereportresultComponent } from './temperaturereportresult.component';

describe('TemperaturereportresultComponent', () => {
  let component: TemperaturereportresultComponent;
  let fixture: ComponentFixture<TemperaturereportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturereportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturereportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
