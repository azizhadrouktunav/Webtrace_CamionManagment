import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-departmenttransfert',
  templateUrl: './departmenttransfert.component.html',
  styleUrls: ['./departmenttransfert.component.scss']
})
export class DepartmenttransfertComponent {
  data: any;
  Form: any;
  resilier = false;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
              public dialogRef: MatDialogRef<DepartmenttransfertComponent>) {
    this.data = _data.Department;

    this.Form = this.createLogForm();

  }

  createLogForm(): FormGroup
    {  
        return new FormGroup({
          Department : new FormControl("")
            
        });
    }
    onSubmit(buttonType) {

      Object.assign(this.Form.value, {  
        transfert: buttonType });  
       this.dialogRef.close(this.Form.value);  
}

// tslint:disable-next-line: typedef
onClose() {

this.dialogRef.close();
}
}
