import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent {

  data: any;
  myForm: any;
  hide = true;
  action: any;
  formdata: any;
  dialogTitle: any;
  submitted: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
    public dialogRef: MatDialogRef<MailComponent> ,
     private translateService: TranslateService,
    ) {
  
      
     
      this.translateService.get(['NAV.bAddMail', 'NAV.bEditMail'])
        .subscribe(data => { this.data = data }
        );
        this.action = _data.action;
        this.formdata = _data.data;
    this.myForm = this.createLogForm();
  

    if (this.action === 'add') {
      this.dialogTitle = this.data["NAV.bAddMail"];
    

    }


    else {
      this.dialogTitle = this.data["NAV.bEditMail"];
  }
    }
  createLogForm(): FormGroup {
    
    return new FormGroup({
      
      email: new FormControl(this.formdata.MailAdress, [Validators.required, , Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      Name: new FormControl(this.formdata.Name, [Validators.required]),
      // DateDebut: new FormControl(this.formdata.DateDebut, [Validators.required]),
      // DateFin: new FormControl(this.formdata.DateFin, [Validators.required]),


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
