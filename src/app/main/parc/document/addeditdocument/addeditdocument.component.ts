import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, ThemePalette } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { days, getDays, recurringMode } from '../../maintenance/department';
import { Document, documentTypes } from '../documentModel';

@Component({
  selector: 'app-addeditdocument',
  templateUrl: './addeditdocument.component.html',
  styleUrls: ['./addeditdocument.component.scss']
})
export class AddeditdocumentComponent {
  addeditForm: FormGroup;
  action: any;
  dialogTitle: string;
  document: Document;
  days = days;
  showDays: boolean = false;
  oneTime: boolean = true;
  recurringMode = recurringMode;
  types = documentTypes;
  public showSpinners = true;
  public showSeconds = true;
  public color: ThemePalette = 'primary';
  public touchUi = false;
  disabled : boolean = false;
  typesEnum: any[];
  @ViewChild('picker',{static: true}) picker: any;
  data: any;

  constructor(private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              public matDialogRef: MatDialogRef<AddeditdocumentComponent>,
              private translateService : TranslateService)
             { 
              this.translateService.get(['NAV.AddDocumentForm', 'NAV.EditDocumentForm'])
              .subscribe(data => { this.data = data }
              );
              this.action = _data.action;
              if ( this.action === 'edit' )
              {
                  this.dialogTitle = this.data['NAV.EditDocumentForm'];
                  this.document = _data.document;
                  this.showDays = this.document.RecurringMode === 2 ? true : false;
                  this.disabled = true;
              }
              else
              {
                this.dialogTitle = this.data['NAV.AddDocumentForm'];
                this.document = new Document();

                this.typesEnum = _data.types;
                if(this.typesEnum.length){
                    this.types = this.types.filter(itm => {
                      return this.typesEnum.indexOf(itm.id) < 0;
                    });
                }
              }
              this.document.EnabledDayOfWeekes = getDays(this.document.IsRecurringSun,this.document.IsRecurringMon,
                this.document.IsRecurringTue, this.document.IsRecurringWed, this.document.IsRecurringThu,
                this.document.IsRecurringFri,this.document.IsRecurringSat);
              this.addeditForm = this.createdataForm();
              
              }
 /**
     * Create the document form
     *
     * @returns {FormGroup}
     */
    createdataForm(): FormGroup
    {  
        return new FormGroup({
          keyTrackingObject: new FormControl(this.document.Car),
          DocumentTypeEnum : new FormControl({value: this.document.DocumentTypeEnum, disabled : this.disabled}, Validators.required ),
          number : new FormControl(this.document.RecFrequencyNYearMonthWeekDay, Validators_.positiveNumberValidator()),
          RecurringMode   : new FormControl(this.document.RecurringMode), // frequence
          BeginStartRecurringDateLocal:  new FormControl(this.document.BeginStartRecurringDateLocal),
          WarnMeBeforeNDay : new FormControl(this.document.WarnMeBeforeNDay, Validators_.positiveNumberValidator()),
          EnabledDayOfWeekes : new FormControl(this.document.EnabledDayOfWeekes),
          EnableGenerateAlert: new FormControl(true)
        });
    }
changedMode(e){
  this.showDays = e.value === 2 ? true : false;
  this.oneTime = e.value === 5 ? false : true;
}
changedDays(e){
    this.document.EnabledDayOfWeekes = e.value;
}

}
