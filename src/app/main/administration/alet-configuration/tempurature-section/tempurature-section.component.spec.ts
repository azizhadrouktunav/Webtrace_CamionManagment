import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TempuratureSectionComponent } from './tempurature-section.component';

describe('TempuratureSectionComponent', () => {
  let component: TempuratureSectionComponent;
  let fixture: ComponentFixture<TempuratureSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TempuratureSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempuratureSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
