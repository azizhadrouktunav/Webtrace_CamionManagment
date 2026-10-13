import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { uniqueValidator } from 'app/main/helpers/validators/uniqueName';

@Component({
  selector: 'app-add-way-dialog',
  templateUrl: './add-way-dialog.component.html',
  styleUrls: ['./add-way-dialog.component.scss']
})
export class WayDialogComponent  {

  action: string;
  dialogTitle: string = 'Common.SaveTrajectory';
  name : FormControl;
  Name: string = null;
  names: string[];
  msgError: string;

constructor(
  public matDialogRef: MatDialogRef<WayDialogComponent>,
  @Inject(MAT_DIALOG_DATA) private _data: any) {
     
     this.names = _data.names;
     this.action = _data.action;
     this.msgError = _data.msgError;
     this.dialogTitle = _data.title;
    if ( this.action === 'edit' )
    {
        this.dialogTitle = _data.title;
        this.Name = _data.way.Value.Name;
    }
    this.name = new FormControl(this.Name, [Validators.required, uniqueValidator(this.names)]);
  }

  get formInvalid(): boolean {
    return this.name.invalid;
  }

  closeAdd(): void {
    this.matDialogRef.close({
      value: this.name.value
    });
  }

  onNoClick(): void {
    this.matDialogRef.close();
  }
}
