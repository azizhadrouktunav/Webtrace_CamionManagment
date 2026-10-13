import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofencereportformComponent } from './geofencereportform.component';

describe('GeofencereportformComponent', () => {
  let component: GeofencereportformComponent;
  let fixture: ComponentFixture<GeofencereportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeofencereportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofencereportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
