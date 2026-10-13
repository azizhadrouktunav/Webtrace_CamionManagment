import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestioDesVehiculesComponent } from './gestio-des-vehicules.component';

describe('GestioDesVehiculesComponent', () => {
  let component: GestioDesVehiculesComponent;
  let fixture: ComponentFixture<GestioDesVehiculesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestioDesVehiculesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestioDesVehiculesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
