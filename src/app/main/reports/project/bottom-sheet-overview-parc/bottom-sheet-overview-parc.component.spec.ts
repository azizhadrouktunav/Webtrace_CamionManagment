import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSheetOverviewParcComponent } from './bottom-sheet-overview-parc.component';

describe('BottomSheetOverviewParcComponent', () => {
  let component: BottomSheetOverviewParcComponent;
  let fixture: ComponentFixture<BottomSheetOverviewParcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomSheetOverviewParcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomSheetOverviewParcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
