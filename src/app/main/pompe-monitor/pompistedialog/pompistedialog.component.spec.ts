import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PompistedialogComponent } from './pompistedialog.component';

describe('PompistedialogComponent', () => {
  let component: PompistedialogComponent;
  let fixture: ComponentFixture<PompistedialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PompistedialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PompistedialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
