import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeigntreportresultComponent } from './weigntreportresult.component';

describe('WeigntreportresultComponent', () => {
  let component: WeigntreportresultComponent;
  let fixture: ComponentFixture<WeigntreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeigntreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeigntreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
