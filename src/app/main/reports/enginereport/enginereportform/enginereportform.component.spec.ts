import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnginereportformComponent } from './enginereportform.component';

describe('EnginereportformComponent', () => {
  let component: EnginereportformComponent;
  let fixture: ComponentFixture<EnginereportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnginereportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnginereportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
