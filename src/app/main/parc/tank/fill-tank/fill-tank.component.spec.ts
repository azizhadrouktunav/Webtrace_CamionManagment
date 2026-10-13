import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillTankComponent } from './fill-tank.component';

describe('FillTankComponent', () => {
  let component: FillTankComponent;
  let fixture: ComponentFixture<FillTankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillTankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
