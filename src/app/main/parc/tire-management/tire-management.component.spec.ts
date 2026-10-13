import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireManagementComponent } from './tire-management.component';

describe('TireManagementComponent', () => {
  let component: TireManagementComponent;
  let fixture: ComponentFixture<TireManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
