import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentmanagmentComponent } from './departmentmanagment.component';

describe('DepartmentmanagmentComponent', () => {
  let component: DepartmentmanagmentComponent;
  let fixture: ComponentFixture<DepartmentmanagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentmanagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentmanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
