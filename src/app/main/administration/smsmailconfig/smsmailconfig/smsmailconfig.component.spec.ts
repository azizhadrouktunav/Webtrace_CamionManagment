import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsmailconfigComponent } from './smsmailconfig.component';

describe('SmsmailconfigComponent', () => {
  let component: SmsmailconfigComponent;
  let fixture: ComponentFixture<SmsmailconfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsmailconfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsmailconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
