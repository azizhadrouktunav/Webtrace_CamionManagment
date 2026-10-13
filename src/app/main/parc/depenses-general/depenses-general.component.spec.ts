import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepensesGeneralComponent } from './depenses-general.component';

describe('DepensesGeneralComponent', () => {
  let component: DepensesGeneralComponent;
  let fixture: ComponentFixture<DepensesGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepensesGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepensesGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
