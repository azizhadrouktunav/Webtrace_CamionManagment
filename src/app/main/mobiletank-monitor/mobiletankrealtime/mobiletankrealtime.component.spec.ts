import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiletankrealtimeComponent } from './mobiletankrealtime.component';

describe('MobiletankrealtimeComponent', () => {
  let component: MobiletankrealtimeComponent;
  let fixture: ComponentFixture<MobiletankrealtimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiletankrealtimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiletankrealtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
