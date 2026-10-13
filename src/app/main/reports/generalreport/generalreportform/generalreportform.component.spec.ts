import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralreportformComponent } from './generalreportform.component';

describe('GeneralreportformComponent', () => {
  let component: GeneralreportformComponent;
  let fixture: ComponentFixture<GeneralreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
