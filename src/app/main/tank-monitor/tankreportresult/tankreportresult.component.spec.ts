import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankreportresultComponent } from './tankreportresult.component';

describe('TankreportresultComponent', () => {
  let component: TankreportresultComponent;
  let fixture: ComponentFixture<TankreportresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankreportresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankreportresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
