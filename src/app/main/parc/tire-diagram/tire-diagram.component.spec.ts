import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireDiagramComponent } from './tire-diagram.component';

describe('TireDiagramComponent', () => {
  let component: TireDiagramComponent;
  let fixture: ComponentFixture<TireDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
