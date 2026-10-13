import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboarddefautreportformComponent } from './dashboarddefautreportform.component';

describe('DashboarddefautreportformComponent', () => {
  let component: DashboarddefautreportformComponent;
  let fixture: ComponentFixture<DashboarddefautreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboarddefautreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboarddefautreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
