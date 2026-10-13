import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartlocresultComponent } from './smartlocresult.component';

describe('SmartlocresultComponent', () => {
  let component: SmartlocresultComponent;
  let fixture: ComponentFixture<SmartlocresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartlocresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartlocresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
