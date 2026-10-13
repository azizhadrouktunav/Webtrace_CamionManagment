import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoefencingSectionComponent } from './goefencing-section.component';

describe('GoefencingSectionComponent', () => {
  let component: GoefencingSectionComponent;
  let fixture: ComponentFixture<GoefencingSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoefencingSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoefencingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
