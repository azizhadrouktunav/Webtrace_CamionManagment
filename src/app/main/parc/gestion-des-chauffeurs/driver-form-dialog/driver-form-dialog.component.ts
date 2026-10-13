import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Driver } from '../model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-driver-form-dialog',
  templateUrl: './driver-form-dialog.component.html',
  styleUrls: ['./driver-form-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DriverFormDialogComponent implements OnInit{

  action: string;
  driver: Driver;
  driverForm: FormGroup;
  dialogTitle: string;
  departments: any[];
  /**
     * Constructor
     *
     * @param {MatDialogRef<DriverFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
      public matDialogRef: MatDialogRef<DriverFormDialogComponent>, 
      @Inject(MAT_DIALOG_DATA) private _data: any,
      private _formBuilder: FormBuilder  ) {
        
         // Set the defaults
         this.action = _data.action;
         this.departments = _data.departments;
         if ( this.action === 'edit' )
         {
             this.dialogTitle = 'NAV.EditDriver';
             this.driver = _data.driver;
         }
         else
         {
             this.dialogTitle = 'NAV.NewDriver';
             this.driver = new Driver({});
         }
 
         this.driverForm = this.createDriverForm();
      }
   ngOnInit() : void {
    this.driverForm.statusChanges.subscribe(
      result => console.log('')
  );
}
 // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create driver form
     *
     * @returns {FormGroup}
     */
    createDriverForm() : FormGroup
    {
     
      return this._formBuilder.group({
        key      : [this.driver.key],
        FirstName    : [this.driver.FirstName, Validators.required],
        LastName: [this.driver.LastName, Validators.required],
        CIN: [this.driver.CIN],
        DepartmentId : [this.driver.DepartmentId, Validators.required],
        Email   : [this.driver.Email.trim(), Validators.email],
        Tel   : [this.driver.Tel],
        Address : [this.driver.Address],
        BirthPlace: [this.driver.BirthPlace],
        BirthDateLocal: [this.driver.BirthDateLocal],
        DriverLicenseNumber   : [this.driver.DriverLicenseNumber],
        DriverLicenseType  : [this.driver.DriverLicenseType],
        DriverCode: [this.driver.DriverCode, [Validators.required,Validators.pattern('([0-9A-F]{4}){1,4}')]],
        Seal: [this.driver.ElockSealCardId],
        UnSeal: [this.driver.ElockUnsealCardId],

        DriverLicenseExpirationDateLocal : [this.driver.DriverLicenseExpirationDateLocal]
      })
    }
    getErrorMessage(control: string) {
      return this.driverForm.controls[control].hasError('required') ? 'You must enter a value' :
          this.driverForm.controls[control].hasError('pattern') ? 'Le nombre doit être composé de 4 ou 16 chiffres !' :'';
    }
}