import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankfuelreportComponent } from './tankfuelreport.component';

describe('TankfuelreportComponent', () => {
  let component: TankfuelreportComponent;
  let fixture: ComponentFixture<TankfuelreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankfuelreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankfuelreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
