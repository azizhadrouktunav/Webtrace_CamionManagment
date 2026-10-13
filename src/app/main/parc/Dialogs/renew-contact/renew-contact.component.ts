import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-renew-contact',
  templateUrl: './renew-contact.component.html',
  styleUrls: ['./renew-contact.component.scss']
})
export class RenewContactComponent  {
  data: any;
  renewForm: any;
  resilier = false;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
              public dialogRef: MatDialogRef<RenewContactComponent>) {
    this.data = _data.element;

    this.renewForm = this.createLogForm();

  }

  createLogForm(): FormGroup
    {  
        return new FormGroup({
          NextRenewDate : new FormControl(new Date(Date.now()))
            
        });
    }
    onSubmit(buttonType) {

      Object.assign(this.renewForm.value, {  
        buttonType: buttonType });

     
       this.dialogRef.close(this.renewForm.value);
    
      
      

}

// tslint:disable-next-line: typedef
onClose() {

this.dialogRef.close();
}
}
