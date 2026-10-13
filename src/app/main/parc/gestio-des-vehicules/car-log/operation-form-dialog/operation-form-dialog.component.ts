import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Operation, typeOperations } from '../../model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-operation-form-dialog',
  templateUrl: './operation-form-dialog.component.html',
  styleUrls: ['./operation-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OperationFormDialogComponent {

  action: string;
  dialogTitle: string;
  operation: Operation;
  operationForm : FormGroup;
  typeOperations: any[] = typeOperations;
  accounts: any[];
  departments: any[];
  drivers: any[];
  data: any;
   /**
     * Constructor
     *
     * @param {MatDialogRef<OperationFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<OperationFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private translateService: TranslateService,
  ) { 
    this.translateService.get(['NAV.Add', 'NAV.Edit'])
    .subscribe(data => { this.data = data }
    );
     // Set the defaults
     this.action = _data.action;
     this.departments = _data.departments;
     this.accounts = _data.accounts;
     this.drivers = _data.drivers;
     if ( this.action === 'edit' )
     {
         this.dialogTitle = this.data['NAV.Edit'];
         this.operation = _data.operation;
     }
     else
     {
         this.dialogTitle = this.data['NAV.Add'];
         this.operation = new Operation();
     }

     this.operationForm = this.createOperationForm();
   }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create operation form
     *
     * @returns {FormGroup}
     */
   createOperationForm(): FormGroup{
    return this._formBuilder.group({
      id : new FormControl(this.operation.Id),
      operationDate      : new FormControl(this.operation.CreatedDateGmt),
      type    : new FormControl(this.operation.OperationType),
      mileage:  new FormControl(this.operation.OperationMileage),
      cost  : new FormControl(this.operation.OperationCost),
      driver: new FormControl(this.operation.Driver),
      department :new FormControl(this.operation.Department),
      accountWorkedBy: new FormControl(this.operation.AccountWorkedBy),
      description   : new FormControl(this.operation.Description),
      comment   : new FormControl(this.operation.Comment)
  });
   }

}
