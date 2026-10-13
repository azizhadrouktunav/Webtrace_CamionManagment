import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-fill-tank',
  templateUrl: './fill-tank.component.html',
  styleUrls: ['./fill-tank.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FillTankComponent{

  action: string;
  dialogTitle: string;
  operationCapacityInL: FormControl;
  constructor(
    public matDialogRef: MatDialogRef<FillTankComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
     
     this.operationCapacityInL = new FormControl(0 , Validators.compose([Validators.required,
      FillTankComponent.nonZero  ]));
  }
static nonZero(control:FormControl):{ [key: string]: any; } {
  if (Number(control.value) < 0) {
    return {nonZero: true};
  } else {
    return null;
  }
}
}