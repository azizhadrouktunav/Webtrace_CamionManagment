import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizedDateTimePipe } from './localized-datetime-pipe.component';

describe('LocalizedDatePipeComponent', () => {
  let component: LocalizedDateTimePipe;
  let fixture: ComponentFixture<LocalizedDateTimePipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalizedDateTimePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizedDateTimePipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
