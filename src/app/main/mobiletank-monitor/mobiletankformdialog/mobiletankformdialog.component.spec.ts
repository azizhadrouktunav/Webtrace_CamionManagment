import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiletankformdialogComponent } from './mobiletankformdialog.component';

describe('MobiletankformdialogComponent', () => {
  let component: MobiletankformdialogComponent;
  let fixture: ComponentFixture<MobiletankformdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiletankformdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiletankformdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
