import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedingreportformComponent } from './speedingreportform.component';

describe('SpeedingreportformComponent', () => {
  let component: SpeedingreportformComponent;
  let fixture: ComponentFixture<SpeedingreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedingreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedingreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
