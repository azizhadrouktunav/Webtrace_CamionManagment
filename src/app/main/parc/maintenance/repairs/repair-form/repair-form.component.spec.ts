import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairFormComponent } from './repair-form.component';

describe('RepairFormComponent', () => {
  let component: RepairFormComponent;
  let fixture: ComponentFixture<RepairFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
