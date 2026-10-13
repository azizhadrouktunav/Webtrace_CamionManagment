import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForcedStopComponent } from './forced-stop.component';

describe('ForcedStopComponent', () => {
  let component: ForcedStopComponent;
  let fixture: ComponentFixture<ForcedStopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForcedStopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcedStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
