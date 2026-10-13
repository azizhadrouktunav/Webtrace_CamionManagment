import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedreportformComponent } from './speedreportform.component';

describe('SpeedreportformComponent', () => {
  let component: SpeedreportformComponent;
  let fixture: ComponentFixture<SpeedreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
