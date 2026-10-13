import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class SmsComponent {

  data: any;
  myForm: any;
  hide = true;
  action: any;
  formdata: any;
  dialogTitle: any;
  submitted: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
    public dialogRef: MatDialogRef<SmsComponent> ,
     private translateService: TranslateService,
    ) {
  
      
     
      this.translateService.get(['NAV.bEditMail', 'NAV.bAddTel'])
        .subscribe(data => { this.data = data }
        );
        this.action = _data.action;
        this.formdata = _data.data;
    this.myForm = this.createLogForm();
  

    if (this.action === 'add') {
      this.dialogTitle = this.data["NAV.bAddTel"];
    

    }


    else {
      this.dialogTitle = this.data["NAV.bEditMail"];
  }
    }
  createLogForm(): FormGroup {
    
    return new FormGroup({
      
      tel: new FormControl(this.formdata.Tel, [Validators.required]),
      Name: new FormControl(this.formdata.Name, [Validators.required]),


    })


  }
  get f() { return this.myForm.controls; }


  onSubmit() {

    this.submitted = true;
    if (this.myForm.invalid) {
      return;
  }
    this.dialogRef.close(this.myForm.value);


  }

  // tslint:disable-next-line: typedef
  onClose() {

    this.dialogRef.close();
  }
}
