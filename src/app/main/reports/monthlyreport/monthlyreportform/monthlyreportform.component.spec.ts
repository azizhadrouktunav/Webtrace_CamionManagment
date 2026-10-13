import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyreportformComponent } from './monthlyreportform.component';

describe('MonthlyreportformComponent', () => {
  let component: MonthlyreportformComponent;
  let fixture: ComponentFixture<MonthlyreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
