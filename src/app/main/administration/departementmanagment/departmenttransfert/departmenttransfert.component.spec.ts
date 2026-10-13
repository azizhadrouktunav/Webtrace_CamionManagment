import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmenttransfertComponent } from './departmenttransfert.component';

describe('DepartmenttransfertComponent', () => {
  let component: DepartmenttransfertComponent;
  let fixture: ComponentFixture<DepartmenttransfertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmenttransfertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmenttransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
