import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Supplier } from '../model';

interface select_opt {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SupplierFormComponent {
  
    action: string;
    supplier: Supplier;
    supplierForm: FormGroup;
    dialogTitle: string;
    suppliers: select_opt[] = [
      {value: true, viewValue: 'Constructor'},
      {value: false, viewValue: 'Supplier'},
    ];
    /**
     * Constructor
     *
     * @param {MatDialogRef<SupplierFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<SupplierFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
    ) {
         this.supplier = _data.supplier
         this.action = _data.action
         if ( this.action === 'edit' )
         {
             this.dialogTitle = 'SupplierEdit';
         }
         else
         {
             this.dialogTitle = 'NewSupplier';
             this.supplier = new Supplier();
         }
         this.supplierForm = this.createSupplierForm();
         if(this.action === 'edit'){
          this.supplierForm.addControl('ID', this._formBuilder.control(this.supplier.ID))
         }
         this.supplierForm.controls.SaveDate.setValue('/Date(' + new Date().getTime() + ')/')
   }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

    /**
     * Create the supplier form
     *
     * @returns {FormGroup}
     */
  createSupplierForm(): FormGroup 
  {
    return new FormGroup({

        Name : new FormControl(this.supplier.Name),
        Address :  new FormControl(this.supplier.Address),
        Description : new FormControl(this.supplier.Description),
        IsDeleted : new FormControl(this.supplier.IsDeleted),
        Mail : new FormControl(this.supplier.Mail, Validators.email),
        MaxBudget : new FormControl(this.supplier.MaxBudget),
        Responsible1Name : new FormControl(this.supplier.Responsible1Name),
        Responsible2Name : new FormControl(this.supplier.Responsible2Name),
        Phone : new FormControl(this.supplier.Phone),
        WebSite : new FormControl(this.supplier.WebSite),
        SaveDate :  new FormControl(this.supplier.SaveDate),
        IsConstructer : new FormControl(this.supplier.IsConstructer)
    })
  }
   
  
}
