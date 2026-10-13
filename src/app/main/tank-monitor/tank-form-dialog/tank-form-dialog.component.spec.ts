import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TankFormDialogComponent } from './tank-form-dialog.component';

describe('TankFormDialogComponent', () => {
  let component: TankFormDialogComponent;
  let fixture: ComponentFixture<TankFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TankFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TankFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
