import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import * as jsPDF from 'jspdf';
import { log } from 'util';
import { PaymentModel } from '../../interfaces/paymentModel';
import { BorrowedRentalService } from '../../services/borrowedrental.service';
import { DatacService } from '../../services/datac.service';
import { PaymentlogComponent } from '../../Dialogs/paymentlog/paymentlog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-contractlog',
  templateUrl: './contractlog.component.html',
  styleUrls: ['./contractlog.component.scss']
})
export class ContractlogComponent implements OnInit {

  displayedColumns = ['InvoiceRef', 'DateInvoiceGMT', 'InvoiceFromGMT', 'InvoiceToGMT', 'Cost', 'PaidCost', 'PaidDateGMT', 'OdometerInKm','actions'];
  datasource: any;
  listdata: any;
  trackingObject: number;
  BCIid: number;
  payments: PaymentModel[] =[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  costfromIndex: any;
  paidcostfromIndex: any;
  searchkey: string;
  UIBorrowedRentalCarContractManagementPara: any =[];
  trackingObjects: any = [];
  CarMatricule = '';
  disabled : false;
  data: any;
  constructor( private route: ActivatedRoute,
               private _borrowedRentalService: BorrowedRentalService,
               private dataService: DatacService,
               private dialog: MatDialog,
               private _snackBar: MatSnackBar,
               private translateService: TranslateService,


    ) {

   }

  ngOnInit() {

    if (this.route.snapshot.params['trackingObject']) {
      this.trackingObject = +this.route.snapshot.params['trackingObject'];
    }

    if (this.route.snapshot.params['ContractId']) {
      this.BCIid = +this.route.snapshot.params['ContractId'];
    }

    if (this.route.snapshot.params['CarMatricule']) {
      this.CarMatricule = this.route.snapshot.params['CarMatricule'];
    }
    this.dataService.sendParams(this.trackingObject, this.BCIid);

   
    this._borrowedRentalService.getBRCInvoice( this.trackingObject, this.BCIid ).then((result) => {

      // tslint:disable-next-line: forin
      result.forEach(elt => {
        this.payments.push(new PaymentModel(elt));
      })
 

      
      this.datasource = this.payments;
      this.listdata = new MatTableDataSource(this.payments);
      this.listdata.sort = this.sort;
      this.listdata.paginator = this.paginator;
      
      this.calculateCost(result);
      
     

      
});    
  }

  addLog()
  {
    const dialogRef = this.dialog.open(PaymentlogComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'add',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result )
              {
                  return;
              }
      this._borrowedRentalService.addBRCInvoice(this.trackingObject,+this.BCIid,result).subscribe((data: any[])=>{ 
         
        this.datasource.push(new PaymentModel (data));
        this.listdata = new MatTableDataSource(this.datasource);
        this.translateService.get(['NAV.InvoiceAdd'])
        .subscribe(data => { this.data = data });
        this._snackBar.open(this.data['NAV.InvoiceAdd'], 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
          });
          
        });
    });
  }

  editInvoice(invoice): void
    {
        

      const dialogRef = this.dialog.open(PaymentlogComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'edit',
          log: invoice        
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if ( !result )
        {
            return;
        }
        this._borrowedRentalService.updateBRCInvoice(this.trackingObject, +this.BCIid,result,invoice.Id).subscribe((data: any[])=>{ 
          var index  = this.datasource.map(x => {return x.Id}).indexOf(invoice.Id);

         
          this.datasource.splice(index, 1,new PaymentModel (data));

          this.listdata = new MatTableDataSource(this.datasource);
          this.translateService.get(['NAV.InvoiceEdit'])
        .subscribe(data => { this.data = data });
          this._snackBar.open(this.data['NAV.InvoiceEdit'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
            
          });
      }); 
 
    }

    deleteInvoice(invoice): void{
      const dialogRef = this.dialog.open(FuseConfirmDialogComponent,{
        data:{
          message: 'Are you sure want to delete?',
          buttonText: {
            ok: 'Delete',
            cancel: 'Cancel',
          }
        }
      });
  
  
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
           this.deleteInvoicelog(invoice.Id);
           this.translateService.get(['NAV.InvoiceRemove'])
           .subscribe(data => { this.data = data });
           this._snackBar.open(this.data["NAV.InvoiceRemove"], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
      });
    }
    deleteInvoicelog(Id){
      var index =  this.datasource.map(x => {return x.Id}).indexOf(Id);
      this._borrowedRentalService.deleteBRCInvoice(this.trackingObject,+this.BCIid,Id).subscribe(res => {
      this.datasource.splice(index, 1);
      this.listdata = new MatTableDataSource(this.datasource);

      console.log('Document is deleted!');
      })
      this.calculateCost(this.datasource);
   }
   
  onfilterClear(){
    this.searchkey = "";
  }
  applyfilter(){
    this.listdata.filter = this.searchkey.trim().toLowerCase();
  }

  downloadPdf() {
    var prepare=[];
    this.datasource.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.InvoiceRef);
      
      tempObj.push(formatDate(e.DateInvoiceGMT,'dd/MM/yyyy', 'fr'));
      tempObj.push(formatDate(e.InvoiceFromGMT,'dd/MM/yyyy', 'fr'));
      tempObj.push(formatDate(e.InvoiceToGMT,'dd/MM/yyyy', 'fr'));
      tempObj.push(e.Cost);
      tempObj.push(e.PaidCost);
      tempObj.push(formatDate(e.PaidDateGMT,'dd/MM/yyyy', 'fr'));
      tempObj.push(e.OdometerInKm);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des factures', 78, 5); //default

    doc.autoTable({
        head: [['Référence',"Date de facture","Facture de","jusqu'à",'Coût','Montant payé','Date de payement','Kilométrage']],
        body: prepare
    });
    doc.save('Payment_List' + '.pdf');
  } 
  getTotalCost() {
    return this.costfromIndex;
  }
  getTotalPaidCost() {
    return this.paidcostfromIndex;
  }
  calculateCost(result)
  { var sum =0;
    var paidsum = 0;
    result.map((val)=>{  
    sum += val.Cost; 
    paidsum += val.PaidCost
    this.costfromIndex = sum.toString();
    this.paidcostfromIndex = paidsum.toString();
 
 })
 }
}
