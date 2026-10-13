import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopSectionComponent } from './stop-section.component';

describe('StopSectionComponent', () => {
  let component: StopSectionComponent;
  let fixture: ComponentFixture<StopSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
