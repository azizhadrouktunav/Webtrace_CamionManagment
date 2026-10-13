import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SinisterMapComponent } from './sinister-map.component';

describe('SinisterMapComponent', () => {
  let component: SinisterMapComponent;
  let fixture: ComponentFixture<SinisterMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SinisterMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SinisterMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
