import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { isNullOrUndefined } from 'util';
import { DocumentLogModel } from '../documentModel';


@Component({
  selector: 'app-log-dialog',
  templateUrl: './log-dialog.component.html',
  styleUrls: ['./log-dialog.component.scss']
})
export class LogDialogComponent {
  logForm: FormGroup;
  action: any;
  dialogTitle: string;
  log: DocumentLogModel;
  @ViewChild('picker',{static: true}) picker: any;
  @ViewChild('picker',{static: true}) picker1: any;
  data: any;
  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              public matDialogRef: MatDialogRef<LogDialogComponent>,
              private translateService : TranslateService)
             { 
              this.translateService.get(['NAV.AddDocumentForm', 'NAV.EditDocumentForm'])
              .subscribe(data => { this.data = data }
              );
              this.action = _data.action;
              if ( this.action === 'new' )
              {
                  this.dialogTitle = 'Ajouter un log des documents';
                  this.log = new DocumentLogModel();
              }

              else if(this.action === 'adjust')
               {
                 this.dialogTitle = 'Régler le document';
                 this.log = !isNullOrUndefined(_data.log) ? _data.log : new DocumentLogModel();
              }
              else
              {
                  this.dialogTitle = 'Modifier le log des documents';
                  this.log = !isNullOrUndefined(_data.log) ? _data.log : new DocumentLogModel();
              }
              this.logForm = this.createLogForm();
              }
 /**
     * Create the log form
     *
     * @returns {FormGroup}
     */
    createLogForm(): FormGroup
    {  
        return new FormGroup({
          keyTrackingObject: new FormControl(this.log.Car),
          IdCarDocumentReminder : new FormControl(this.log.CarDocumentReminder),
          IdCarDocumentLog: new FormControl(this.log.Id),
          Cost: new FormControl(this.log.Cost, [Validators.required ,Validators_.positiveNumberValidator()]),
          PaidCost: new FormControl(this.log.PaidCost, [Validators.required,Validators_.positiveNumberValidator()]),
          DateAvailableFromLocal: new FormControl(this.log.DateAvailableFromGMT),
          DateAvailableToLocal: new FormControl(this.log.DateAvailableToGMT),
          Description  : new FormControl(this.log.Description),
          InvoiceReference: new FormControl(this.log.InvoiceReference),
          PaidDateLocal: new FormControl(this.log.PaidDateLocal),
          Supplier: new FormControl(this.log.Supplier)
        });
    }
    getErrorMessage(control: string) {
      return this.logForm.controls[control].hasError('required') ? 'You must enter a value' :
          this.logForm.controls[control].hasError('nonPositive') ? 'The number should be greater than 0!' :'';
    }
}
