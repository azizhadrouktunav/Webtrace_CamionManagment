import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralSectionComponent } from './general-section.component';

describe('GeneralSectionComponent', () => {
  let component: GeneralSectionComponent;
  let fixture: ComponentFixture<GeneralSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
