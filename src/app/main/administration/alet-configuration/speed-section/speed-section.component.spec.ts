import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedSectionComponent } from './speed-section.component';

describe('SpeedSectionComponent', () => {
  let component: SpeedSectionComponent;
  let fixture: ComponentFixture<SpeedSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
