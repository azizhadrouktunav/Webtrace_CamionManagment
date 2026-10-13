import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompetrackingComponent } from './pompetracking.component';

describe('PompetrackingComponent', () => {
  let component: PompetrackingComponent;
  let fixture: ComponentFixture<PompetrackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompetrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompetrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
