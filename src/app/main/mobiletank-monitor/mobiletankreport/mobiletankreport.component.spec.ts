import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobiletankreportComponent } from './mobiletankreport.component';

describe('MobiletankreportComponent', () => {
  let component: MobiletankreportComponent;
  let fixture: ComponentFixture<MobiletankreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobiletankreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobiletankreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
