import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedingreportresultComponent } from './speedingreportresult.component';

describe('SpeedingreportresultComponent', () => {
  let component: SpeedingreportresultComponent;
  let fixture: ComponentFixture<SpeedingreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedingreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedingreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
