import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompereportresultComponent } from './pompereportresult.component';

describe('PompereportresultComponent', () => {
  let component: PompereportresultComponent;
  let fixture: ComponentFixture<PompereportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompereportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompereportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
