import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddTireLogComponent } from './edit-add-tire-log.component';

describe('EditAddTireLogComponent', () => {
  let component: EditAddTireLogComponent;
  let fixture: ComponentFixture<EditAddTireLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAddTireLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAddTireLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
