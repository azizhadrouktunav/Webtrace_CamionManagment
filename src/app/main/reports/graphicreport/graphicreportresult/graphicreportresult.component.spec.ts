import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicreportresultComponent } from './graphicreportresult.component';

describe('GraphicreportresultComponent', () => {
  let component: GraphicreportresultComponent;
  let fixture: ComponentFixture<GraphicreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphicreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphicreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
