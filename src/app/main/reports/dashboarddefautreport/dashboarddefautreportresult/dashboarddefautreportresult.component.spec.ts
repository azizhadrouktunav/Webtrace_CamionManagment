import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboarddefautreportresultComponent } from './dashboarddefautreportresult.component';

describe('DashboarddefautreportresultComponent', () => {
  let component: DashboarddefautreportresultComponent;
  let fixture: ComponentFixture<DashboarddefautreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboarddefautreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboarddefautreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
