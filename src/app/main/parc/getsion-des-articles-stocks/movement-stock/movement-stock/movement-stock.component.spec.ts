import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementStockComponent } from './movement-stock.component';

describe('MovementStockComponent', () => {
  let component: MovementStockComponent;
  let fixture: ComponentFixture<MovementStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovementStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovementStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
