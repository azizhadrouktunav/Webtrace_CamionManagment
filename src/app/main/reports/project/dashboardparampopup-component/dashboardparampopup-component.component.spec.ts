import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardparampopupComponentComponent } from './dashboardparampopup-component.component';

describe('DashboardparampopupComponentComponent', () => {
  let component: DashboardparampopupComponentComponent;
  let fixture: ComponentFixture<DashboardparampopupComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardparampopupComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardparampopupComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
