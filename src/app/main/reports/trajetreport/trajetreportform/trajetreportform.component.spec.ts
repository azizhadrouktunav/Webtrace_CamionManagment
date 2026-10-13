import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajetreportformComponent } from './trajetreportform.component';

describe('TrajetreportformComponent', () => {
  let component: TrajetreportformComponent;
  let fixture: ComponentFixture<TrajetreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajetreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajetreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
