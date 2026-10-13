import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetreportresultComponent } from './trajetreportresult.component';

describe('TrajetreportresultComponent', () => {
  let component: TrajetreportresultComponent;
  let fixture: ComponentFixture<TrajetreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
