import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAxleComponent } from './edit-axle.component';

describe('EditAxleComponent', () => {
  let component: EditAxleComponent;
  let fixture: ComponentFixture<EditAxleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAxleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAxleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
