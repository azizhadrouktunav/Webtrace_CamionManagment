import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractlogComponent } from './contractlog.component';

describe('ContractlogComponent', () => {
  let component: ContractlogComponent;
  let fixture: ComponentFixture<ContractlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
