import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedreportresultComponent } from './speedreportresult.component';

describe('SpeedreportresultComponent', () => {
  let component: SpeedreportresultComponent;
  let fixture: ComponentFixture<SpeedreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
