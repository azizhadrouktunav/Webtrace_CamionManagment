import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTankComponent } from './new-tank.component';

describe('NewTankComponent', () => {
  let component: NewTankComponent;
  let fixture: ComponentFixture<NewTankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
