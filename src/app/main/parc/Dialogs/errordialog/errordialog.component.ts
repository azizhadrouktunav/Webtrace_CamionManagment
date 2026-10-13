import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-errordialog',
  templateUrl: './errordialog.component.html',
  styleUrls: ['./errordialog.component.scss']
})
export class ErrordialogComponent  {
  public confirmMessage: string;
  constructor(public dialogRef: MatDialogRef<ErrordialogComponent>) { }

 

}
