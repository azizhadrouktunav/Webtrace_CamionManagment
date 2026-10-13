import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireManagementLogComponent } from './tire-management-log.component';

describe('TireManagementLogComponent', () => {
  let component: TireManagementLogComponent;
  let fixture: ComponentFixture<TireManagementLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireManagementLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireManagementLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
