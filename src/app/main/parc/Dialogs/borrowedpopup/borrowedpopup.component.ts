import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BorrowedModel } from '../../interfaces/borrowedrentalModel';
import { BorrowedRentalService } from '../../services/borrowedrental.service';
import { result } from 'lodash';
import { ErrordialogComponent } from '../errordialog/errordialog.component';
import { json2array } from 'app/main/helpers/must-match.validator';;

@Component({
  selector: 'app-borrowedpopup',
  templateUrl: './borrowedpopup.component.html',
  styleUrls: ['./borrowedpopup.component.scss']
})
export class BorrowedpopupComponent  {
  myForm: FormGroup
  step = 0;
  action: any;
  dialogTitle: string;
  formdata: any;
  UIBorrowedRentalCarContractManagementPara: any[];
  DriverList:  any[];
  CarFree: boolean;
  confirmDialogRef: any;
  contractList: any;
  Id: number;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  constructor(public dialogRef: MatDialogRef<BorrowedpopupComponent>,
              private fb: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private dialog: MatDialog,
              private _borrowedRentalService: BorrowedRentalService) {

                this._borrowedRentalService.getUIBorrowedRentalCarContractManagementParam().then((result) => {
                  //console.log(result);
                  this.UIBorrowedRentalCarContractManagementPara = json2array(result);
                  this.DriverList = json2array(this.UIBorrowedRentalCarContractManagementPara[5]);

                });  

                this.action = _data.action;
                this.formdata = _data.formdata;
                if ( this.action === 'add' )
                {
                    this.dialogTitle = 'AddContract';
                    this.formdata = new BorrowedModel({
                      action: _data.action
                      
                  });
                }
  
                
                else
                {
                    this.dialogTitle = 'UpdateContract';
                    
                }
      this.myForm = this.createForm();
      this.contractList = _data.contractList;

     }
   
   
    
  
       

  createForm(): FormGroup
  {  
      return new FormGroup({
        Contract: new FormGroup({
          ContractRef:  new FormControl(this.formdata.ContractRef),
          ContractType: new FormControl('' + this.formdata.ContractType),
          ContractStartDateGMT: new FormControl(new Date(parseInt(this.formdata.ContractStartDateGMT.substr(6)))),
          ContractEndDateGMT: new FormControl(new Date(parseInt(this.formdata.ContractEndDateGMT.substr(6)))),
          FirstDriver: new FormControl(this.formdata.FirstDriver),
          SecondDriver: new FormControl(this.formdata.SecondDriver)  
        }),
        Payment: new FormGroup({
          ActivationCost:  new FormControl(this.formdata.ActivationCost),  
          Cost: new FormControl(this.formdata.Cost) , 
          GazFuelLevelPercent:  new FormControl(this.formdata.GazFuelLevelPercent) , 
          WarnMeBeforeNDay:  new FormControl(this.formdata.WarnMeBeforeNDay) , 
          Paymentof:  new FormControl(this.formdata.RecurringCost) , 
          foreach:  new FormControl('' + this.formdata.RecurringDateConfig)  ,
          From:  new FormControl(new Date(parseInt(this.formdata.BeginStartRecurringDateGMT.substr(6))))
          
        }),
        carentry: new FormGroup({
          Dateofentry:  new FormControl(new Date(parseInt(this.formdata.CarInDateGMT.substr(6)))) , 
          Mileage:  new FormControl(this.formdata.OdometerInKm) 
        }),
        carexit: new FormGroup({
          Dateofexit:  new FormControl (new Date(parseInt(this.formdata.CarOutDateGMT.substr(6)))) ,
          Mileage2:  new FormControl(this.formdata.OdometerOutKm) 
        })
      });
  }
// tslint:disable-next-line: typedef
onSubmit() {
  if(this.formdata.Id == undefined)
  {this.Id = -1;}
  else
  {this.Id = this.formdata.Id}
  this.CarFree = this.isCarFreeBetween(this.myForm.value.Contract.ContractStartDateGMT, this.myForm.value.Contract.ContractStartDateGMT,this.Id);
        if (!this.CarFree)
         {this.confirmDialogRef = this.dialog.open(ErrordialogComponent, {
          disableClose: false
      });
      
      this.confirmDialogRef.componentInstance.confirmMessage = 'Emprunté ou loué dans cette période';

      
      return ;

        }
        else{
  this.dialogRef.close(this.myForm.value);}
}
onClose() {

this.dialogRef.close();
}

isCarFreeBetween(startDateLocal, endDateLocal,id) {
  var state = true;
  // tslint:disable-next-line: forin
  // tslint:disable-next-line: prefer-for-of
  var index  = this.contractList.map(x => {return x.Id}).indexOf(id);
       

  for (let i = 0 ; i < this.contractList.length; i++) {

    if(i!=index)
     { 

         state = this.isAvailable(startDateLocal.getTime(), this.contractList[i].ContractStartDate, endDateLocal.getTime(), this.contractList[i].ContractEndDate);
     if (state === false) {
       return false;
    }
  }}
  return state;
}

isAvailable(e1start, e2start, e1end, e2end)

{
  return (e1start > e2end.getTime() && e1end > e2end.getTime() || e1start < e2start.getTime() && e1end < e2start.getTime());
}
}


