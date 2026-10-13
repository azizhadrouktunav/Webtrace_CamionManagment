import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalizedDatePipe } from './localized-date-pipe.component';

describe('LocalizedDatePipeComponent', () => {
  let component: LocalizedDatePipe;
  let fixture: ComponentFixture<LocalizedDatePipe>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalizedDatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalizedDatePipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
