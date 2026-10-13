import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowsinistreComponent } from './followsinistre.component';

describe('FollowsinistreComponent', () => {
  let component: FollowsinistreComponent;
  let fixture: ComponentFixture<FollowsinistreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowsinistreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowsinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
