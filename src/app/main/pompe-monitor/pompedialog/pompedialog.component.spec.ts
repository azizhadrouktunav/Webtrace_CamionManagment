import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompedialogComponent } from './pompedialog.component';

describe('PompedialogComponent', () => {
  let component: PompedialogComponent;
  let fixture: ComponentFixture<PompedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
