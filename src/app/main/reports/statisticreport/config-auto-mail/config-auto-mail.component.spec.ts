import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigAutoMailComponent } from './config-auto-mail.component';

describe('ConfigAutoMailComponent', () => {
  let component: ConfigAutoMailComponent;
  let fixture: ComponentFixture<ConfigAutoMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigAutoMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigAutoMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
