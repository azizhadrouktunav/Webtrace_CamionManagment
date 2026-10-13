import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelSectionComponent } from './fuel-section.component';

describe('FuelSectionComponent', () => {
  let component: FuelSectionComponent;
  let fixture: ComponentFixture<FuelSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuelSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuelSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
