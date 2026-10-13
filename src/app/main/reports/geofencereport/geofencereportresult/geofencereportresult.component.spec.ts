import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofencereportresultComponent } from './geofencereportresult.component';

describe('GeofencereportresultComponent', () => {
  let component: GeofencereportresultComponent;
  let fixture: ComponentFixture<GeofencereportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofencereportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofencereportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
