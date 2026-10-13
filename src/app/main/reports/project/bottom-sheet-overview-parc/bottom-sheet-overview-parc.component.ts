import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-bottom-sheet-overview-parc',
  templateUrl: './bottom-sheet-overview-parc.component.html',
  styleUrls: ['./bottom-sheet-overview-parc.component.scss']
})
export class BottomSheetOverviewParcComponent implements OnInit {
  listReminder: any;
  Type: any;

  constructor(private bottomSheetRef: MatBottomSheetRef<BottomSheetOverviewParcComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
  ) {}
  ngOnInit() {
   
    this.Type = this.data.type
    this.listReminder = this.data.data;
  }

}
