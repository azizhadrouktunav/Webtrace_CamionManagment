import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompistemanagmentComponent } from './pompistemanagment.component';

describe('PompistemanagmentComponent', () => {
  let component: PompistemanagmentComponent;
  let fixture: ComponentFixture<PompistemanagmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompistemanagmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompistemanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
