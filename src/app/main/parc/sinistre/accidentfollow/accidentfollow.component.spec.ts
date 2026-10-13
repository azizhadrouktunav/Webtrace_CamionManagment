import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentfollowComponent } from './accidentfollow.component';

describe('AccidentfollowComponent', () => {
  let component: AccidentfollowComponent;
  let fixture: ComponentFixture<AccidentfollowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentfollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentfollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
