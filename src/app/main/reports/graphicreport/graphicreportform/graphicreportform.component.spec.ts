import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicreportformComponent } from './graphicreportform.component';

describe('GraphicreportformComponent', () => {
  let component: GraphicreportformComponent;
  let fixture: ComponentFixture<GraphicreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
