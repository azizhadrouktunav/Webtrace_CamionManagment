import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { passwordMatchValidator } from 'app/main/helpers/password-validator';

@Component({
  selector: 'app-updatepassword',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent {

  data: any;
  myForm: any;
  hide = true;
  disabled = false;
  errorMatcher : any;
  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
    public dialogRef: MatDialogRef<UpdatepasswordComponent>) {

    this.myForm = this.createLogForm();


  }

  

  createLogForm(): FormGroup {
    return new FormGroup({
      password: new FormControl('', [Validators.required, Validators.minLength(6), hasLettersAndNumbers]),
      verifyPassword: new FormControl('', [Validators.required, Validators.minLength(6),
        passwordMatchValidator('password')
      ])

    })
    

  }
 

  onSubmit() {


    this.dialogRef.close(this.myForm.value);


  }

  // tslint:disable-next-line: typedef
  onClose() {

    this.dialogRef.close();
  }
}

function hasLettersAndNumbers(control: FormControl): { [key: string]: boolean } | null {
  const value = control.value;
  const hasLetters = /[a-zA-Z]/.test(value);
  const hasNumbers = /\d/.test(value);

  if (!hasLetters || !hasNumbers) {
    return { hasLettersAndNumbers: true };
  }

  return null;
}