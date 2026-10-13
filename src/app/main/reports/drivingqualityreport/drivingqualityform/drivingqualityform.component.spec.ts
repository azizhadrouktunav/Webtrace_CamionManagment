import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingqualityformComponent } from './drivingqualityform.component';

describe('DrivingqualityformComponent', () => {
  let component: DrivingqualityformComponent;
  let fixture: ComponentFixture<DrivingqualityformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrivingqualityformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingqualityformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
