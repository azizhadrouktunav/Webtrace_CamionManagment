import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassingknownplaceresultComponent } from './passingknownplaceresult.component';

describe('PassingknownplaceresultComponent', () => {
  let component: PassingknownplaceresultComponent;
  let fixture: ComponentFixture<PassingknownplaceresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassingknownplaceresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassingknownplaceresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
