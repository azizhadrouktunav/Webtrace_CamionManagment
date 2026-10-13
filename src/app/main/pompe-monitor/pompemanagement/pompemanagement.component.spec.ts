import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompemanagementComponent } from './pompemanagement.component';

describe('PompemanagementComponent', () => {
  let component: PompemanagementComponent;
  let fixture: ComponentFixture<PompemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
