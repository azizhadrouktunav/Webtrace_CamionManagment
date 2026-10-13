import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiletankreportresultComponent } from './mobiletankreportresult.component';

describe('MobiletankreportresultComponent', () => {
  let component: MobiletankreportresultComponent;
  let fixture: ComponentFixture<MobiletankreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiletankreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiletankreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
