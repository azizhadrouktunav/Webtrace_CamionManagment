import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductSectionComponent } from './conduct-section.component';

describe('ConductSectionComponent', () => {
  let component: ConductSectionComponent;
  let fixture: ComponentFixture<ConductSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConductSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
