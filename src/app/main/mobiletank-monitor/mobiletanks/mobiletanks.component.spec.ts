import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiletanksComponent } from './mobiletanks.component';

describe('MobiletanksComponent', () => {
  let component: MobiletanksComponent;
  let fixture: ComponentFixture<MobiletanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiletanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiletanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
