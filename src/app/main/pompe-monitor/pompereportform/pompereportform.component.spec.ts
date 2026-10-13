import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompereportformComponent } from './pompereportform.component';

describe('PompereportformComponent', () => {
  let component: PompereportformComponent;
  let fixture: ComponentFixture<PompereportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompereportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompereportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
