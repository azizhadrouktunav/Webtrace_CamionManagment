import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Beneficiary } from '../model';
import { BeneficiaryService } from '../beneficiary.service';
import { json2array } from 'app/main/helpers/must-match.validator';

@Component({
  selector: 'app-beneficiary-form',
  templateUrl: './beneficiary-form.component.html',
  styleUrls: ['./beneficiary-form.component.scss']
})
export class BeneficiaryFormComponent  {
 
  action: string;
  dialogTitle: string;
  beneficiary: Beneficiary;
  beneficiaryForm: FormGroup;
  ListDriver:any[]
  ListTracking:any[]
  departments:any[] = []
  ListAccount:any[]
  IdCustomer:number
  constructor(
    public matDialogRef: MatDialogRef<BeneficiaryFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _beneficiaryService:BeneficiaryService
  ) { 
    this.beneficiary = _data.beneficiary
    this.action = _data.action
   
      this.ListDriver = _data.ListDriver;
      this.ListAccount = _data.ListAccount;
      this.ListTracking = _data.ListTracking;
      this.departments = _data.departments;
      this.IdCustomer = _data.IdCustomer;

    if ( this.action === 'edit' )
    { 
        this.dialogTitle = 'Beneficiary.edit';
    }
    else
    {
        this.dialogTitle = 'Beneficiary.new';
        this.beneficiary = new Beneficiary()
    }
    this.beneficiaryForm = this.createForm();

    this.beneficiaryForm.get('IdCustomer').setValue(this.IdCustomer)

  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  
    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createForm(): FormGroup {

      return new FormGroup({
        //ID : new FormControl(this.beneficiary.ID),
        FirstName : new FormControl(this.beneficiary.FirstName , Validators.required),
        Adresse : new FormControl(this.beneficiary.Adresse , Validators.required),
        Email : new FormControl(this.beneficiary.Email, Validators.required),
        Telephone : new FormControl(this.beneficiary.Telephone, Validators.required),
        Web : new FormControl(this.beneficiary.Web, Validators.required),
        IdCustomer: new FormControl(this.beneficiary.IdCustomer),

      })
      //throw new Error("Method not implemented.");
    }
    // get department object
    selected(event){
      const department_ = this.departments.find(department => department.Name === event.value)
      this.beneficiaryForm.get('IdDepartment').setValue(department_.Id)
      //this.beneficiaryForm.get('IdCustomer').setValue(department_.Customer)
      this.beneficiaryForm.get('IdCustomer').setValue(this.IdCustomer)
    }
  // get account
  selectedAcc(event){
    const account_ = this.ListAccount.find(account => account.Login === event.value)
    //this.beneficiaryForm.get('Account').setValue(account_)
    this.beneficiaryForm.get('IdCompte').setValue(account_.Id)
  }
  // get driver
  selectedDriver(event){
    
    const driver_ = this.ListDriver.find(driver => driver.FullName === event.value)
    //this.beneficiaryForm.get('Driver').setValue(driver_)
    this.beneficiaryForm.get('IdDriver').setValue(driver_.key) 
  }
  // get car
  selectedCar(event){
    const car_ = this.ListTracking.find(car => car.FullName === event.value)
    //this.beneficiaryForm.get('TrackingTarget').setValue(car_)
    this.beneficiaryForm.get('IdTrackingTarget').setValue(car_.Key)
  }
}
