import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WayDialogComponent } from './add-way-dialog.component';

describe('WayDialogComponent', () => {
  let component: WayDialogComponent;
  let fixture: ComponentFixture<WayDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WayDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
