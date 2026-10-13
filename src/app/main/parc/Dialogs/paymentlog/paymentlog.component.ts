import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { DocumentLogModel } from '../../document/documentModel';
import { InvoiceModel } from '../../document/InvoiceModel';

@Component({
  selector: 'app-paymentlog',
  templateUrl: './paymentlog.component.html',
  styleUrls: ['./paymentlog.component.scss']
})
export class PaymentlogComponent {
  action: any;
  log: any;
  dialogTitle: string;
  paymentForm: any;

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
  // tslint:disable-next-line: align
  public dialogRef: MatDialogRef<PaymentlogComponent>) {
    this.action = _data.action;
    this.log = _data.log;
    if ( this.action === 'add' )
    {
        this.dialogTitle = 'AddInvoice';
        this.log = new InvoiceModel({});
    }
    else if(this.action === 'adjust')
    {this.dialogTitle = 'AdjustInvoice';
       this.log = new InvoiceModel({});
    }
    
    else
    {
        this.dialogTitle = 'EditInvoice';
        
    }
    this.paymentForm = this.createLogForm();
    } 
  
    createLogForm(): FormGroup
    {  
        return new FormGroup({
          InvoiceRef : new FormControl(this.log.InvoiceRef),
          InvoiceFromGMT : new FormControl(this.log.InvoiceFromGMT),
          InvoiceToGMT : new FormControl(this.log.InvoiceToGMT),
          Cost   : new FormControl(this.log.Cost),
          PaidCost: new FormControl(this.log.PaidCost),
          PaidDateGMT  : new FormControl(this.log.PaidDateGMT),
          DateInvoiceGMT: new FormControl(this.log.DateInvoiceGMT),
          OdometerOutKm: new FormControl(this.log.OdometerInKm) 
        });

  }

 
  onSubmit() {
        
    this.dialogRef.close(this.paymentForm.value);

}
// tslint:disable-next-line: typedef
onClose() {

this.dialogRef.close();
}


}