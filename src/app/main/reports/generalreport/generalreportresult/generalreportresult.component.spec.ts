import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralreportresultComponent } from './generalreportresult.component';

describe('GeneralreportresultComponent', () => {
  let component: GeneralreportresultComponent;
  let fixture: ComponentFixture<GeneralreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
