import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditsinistreComponent } from './add-editsinistre.component';

describe('AddEditsinistreComponent', () => {
  let component: AddEditsinistreComponent;
  let fixture: ComponentFixture<AddEditsinistreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditsinistreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditsinistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
