import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurablereportComponent } from './configurablereport.component';

describe('ConfigurablereportComponent', () => {
  let component: ConfigurablereportComponent;
  let fixture: ComponentFixture<ConfigurablereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurablereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurablereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
