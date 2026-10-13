import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeigntreportformComponent } from './weigntreportform.component';

describe('WeigntreportformComponent', () => {
  let component: WeigntreportformComponent;
  let fixture: ComponentFixture<WeigntreportformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeigntreportformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeigntreportformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
