import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierMngmntComponent } from './supplier-mngmnt.component';

describe('SupplierMngmntComponent', () => {
  let component: SupplierMngmntComponent;
  let fixture: ComponentFixture<SupplierMngmntComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierMngmntComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierMngmntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
