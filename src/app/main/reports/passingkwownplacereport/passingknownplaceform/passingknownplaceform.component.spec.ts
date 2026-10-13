import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassingknownplaceformComponent } from './passingknownplaceform.component';

describe('PassingknownplaceformComponent', () => {
  let component: PassingknownplaceformComponent;
  let fixture: ComponentFixture<PassingknownplaceformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassingknownplaceformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassingknownplaceformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
