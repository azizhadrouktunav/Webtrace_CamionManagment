import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddTireComponent } from './edit-add-tire.component';

describe('EditAddTireComponent', () => {
  let component: EditAddTireComponent;
  let fixture: ComponentFixture<EditAddTireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAddTireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAddTireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
