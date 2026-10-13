import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentpopupComponent } from './departmentpopup.component';

describe('DepartmentpopupComponent', () => {
  let component: DepartmentpopupComponent;
  let fixture: ComponentFixture<DepartmentpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
