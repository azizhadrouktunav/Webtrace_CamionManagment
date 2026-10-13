import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatemovementComponent } from './updatemovement.component';

describe('UpdatemovementComponent', () => {
  let component: UpdatemovementComponent;
  let fixture: ComponentFixture<UpdatemovementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatemovementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatemovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
