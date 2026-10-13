import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditdocumentComponent } from './addeditdocument.component';

describe('AddeditdocumentComponent', () => {
  let component: AddeditdocumentComponent;
  let fixture: ComponentFixture<AddeditdocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditdocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditdocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
