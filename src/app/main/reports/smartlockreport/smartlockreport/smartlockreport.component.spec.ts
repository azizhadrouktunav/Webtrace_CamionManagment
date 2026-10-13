import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartlockreportComponent } from './smartlockreport.component';

describe('SmartlockreportComponent', () => {
  let component: SmartlockreportComponent;
  let fixture: ComponentFixture<SmartlockreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartlockreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartlockreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
