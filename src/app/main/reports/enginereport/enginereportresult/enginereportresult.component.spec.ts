import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnginereportresultComponent } from './enginereportresult.component';

describe('EnginereportresultComponent', () => {
  let component: EnginereportresultComponent;
  let fixture: ComponentFixture<EnginereportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnginereportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnginereportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
