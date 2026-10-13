import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../i18n/en';
import { locale as french } from '../../i18n/fr';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar, MatDialog, MatTabChangeEvent } from '@angular/material';

import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';  
import { Router } from '@angular/router';
import { BorrowedModel } from '../../interfaces/borrowedrentalModel';
import { BorrowedRentalService } from '../../services/borrowedrental.service';
import { DatacService } from '../../services/datac.service';
import { BorrowedpopupComponent } from '../../Dialogs/borrowedpopup/borrowedpopup.component';
import { PaymentlogComponent } from '../../Dialogs/paymentlog/paymentlog.component';
import { RenewContactComponent } from '../../Dialogs/renew-contact/renew-contact.component';
import { PlanningModel } from '../../interfaces/planning';
import { json2array } from 'app/main/helpers/must-match.validator';import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
;


@Component({
  selector: 'app-borrowedcarmanagement',
  templateUrl: './borrowedcarmanagement.component.html',
  styleUrls: ['./borrowedcarmanagement.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class BorrowedcarmanagementComponent implements OnInit , OnDestroy{
  private _unsubscribeAll: Subject<any>;
  selectedOption: string;
  datasource: any = [];
  dataSource = new MatTableDataSource<BorrowedModel>();
  disabled = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  searchkey: string;
  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;

  tableColumns = ['ContractType', 'ContractStartDate', 'ContractEndDate', 'ActivationCost', 'RecurringCost', 'FirstDriver', 'actions']; // 'ActivationCost','RecurringCost','FirstDriver',
  UIBorrowedRentalCarContractManagementPara: any;
  DriverList: any;
  CarFree: boolean;
  confirmDialogRef: any;
  data: any;
  result: any;
  trackingObject: number;
  ContractId: number;
  ContractTypeString: number;
  contracts: BorrowedModel[] = [];
  BCIid: any;
  trackingObjects: any[];
  currentTab: number = 0;
  event: any =[];
  planning: any =[];
  CarMatricule: any;
  filteredOptions: Observable<string[]>;
  isDisabledDelete = true;
  vehicules = this.fb.group({
    cars: ['']
  });

  constructor( 
     private _fuseTranslationLoaderService: FuseTranslationLoaderService,
     private _borrowedRentalService: BorrowedRentalService,
     private _snackBar: MatSnackBar,
     private dialog: MatDialog,
     private router: Router,
     private dataService: DatacService,
     private translateService: TranslateService,
    private fb: FormBuilder,
     ) 
  {  
    this._fuseTranslationLoaderService.loadTranslations(english, french);
    this._unsubscribeAll = new Subject();
   
  }

  ngOnInit() {
    
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    /* this._documentmanagmentService.getTrcakingObjects().pipe(takeUntil(this._unsubscribeAll)
      ).subscribe((data: any[]) => {
      console.log(data);
      this.trackingObjects = decrypt(data);
    }); */
    this._borrowedRentalService.getUIBorrowedRentalCarContractManagementParam().then((result) => {
    
      this.UIBorrowedRentalCarContractManagementPara = json2array(result);
      this.DriverList = json2array(this.UIBorrowedRentalCarContractManagementPara[5]);
      this.trackingObjects = json2array(this.UIBorrowedRentalCarContractManagementPara[0]);
      BorrowedModel.DriverList = this.DriverList;
      //this.vehicules.get('cars').setValue(this.trackingObjects[0].Key);
      this.filteredOptions = this.vehicules.get('cars').valueChanges
      .pipe(
        startWith(''),
        map(value => value ? this._filter(value): this.trackingObjects.slice())
      );
    });    
   
    this.dataService.fetchParams().subscribe(params => {
      this.trackingObject = params.trackingObject;
      this.BCIid = params.BCIid;
      this.selectedOption = '' + params.trackingObject ;
      
    });

    if(this.selectedOption != 'undefined') {

      this.updatetable();
       }
    
    
    
       
  }
  private _sliser(){
    if(this.trackingObjects != null)
      this.trackingObjects.slice()
    return this.trackingObjects;
  }
  private _filter(value: string): string[]{
    if(value.length > 1) {
      const filterValue = value.toLowerCase();
      
      return this.trackingObjects.filter(option => option.FullName.toLowerCase().includes(filterValue));
    }else{
      return this.trackingObjects;
    }
  }
  displayFn = (car) => {
    if(car != null && this.trackingObjects != null)
      return this.trackingObjects.find(x => x.Key === car).FullName;
    return '';
    //? driver.Name : '';
  }
  selected(event) {
    this.selectedOption = event.value;
    this.updatetable();
  }
   /**
     * Add BorrowedRentalCarContract
     */
    addBorrowedRentalCarContract(): void {
      const dialogRef = this.dialog.open(BorrowedpopupComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'add',
          contractList: this.datasource
                  
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if ( !result )
                {
                    return;
                }
       
        this._borrowedRentalService.addOrUpdateBorrowedRentalCarContract(+this.selectedOption, -1, result).subscribe((data: any[]) => { 
           if(data){
          this.datasource.push(new BorrowedModel (data));
          this.dataSource = new MatTableDataSource(this.datasource);
          this.UpdatePlanning(this.datasource);

          this.translateService.get(['NAV.ContractAdd'])
          .subscribe(data => { this.data = data });

          this._snackBar.open(this.data["NAV.ContractAdd"], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
           }
          });
      });
 
    }

    /**
     * edit BorrowedRentalCarContract
     */
    editBorrowedRentalCarContract(formdata): void {
      const dialogRef = this.dialog.open(BorrowedpopupComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'edit',
          formdata: formdata,
          contractList: this.datasource 
                  
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if ( !result )
                {
                    return;
                }

        this._borrowedRentalService.addOrUpdateBorrowedRentalCarContract(+this.selectedOption, formdata.Id, result).subscribe((data: any[]) => { 
         
          var index = index = this.datasource.map(x => {return x.Id}).indexOf(formdata.Id);
         
          this.datasource.splice(index, 1, new BorrowedModel (data));

          //this.datasource.push(new BorrowedModel (data));
          this.dataSource = new MatTableDataSource(this.datasource);
          this.UpdatePlanning(this.datasource);
          this.translateService.get(['NAV.ContractEdit'])
          .subscribe(data => { this.data = data });
          this._snackBar.open((this.data ["NAV.ContractEdit"]), 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
            
          });
      });
 
    }
    
     /**
     * Delete BorrowedRentalCarContract
     */
    deleteBorrowedRentalCarContract(element): void{
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
           this.deleteContract(element.Id);
           this.translateService.get(['NAV.ContractRemove'])
           .subscribe(data => { this.data = data });
           this._snackBar.open(this.data["NAV.ContractRemove"], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
      });
    }
    deleteContract(Id){
      var index = index = this.datasource.map(x => {return x.Id}).indexOf(Id);
      this._borrowedRentalService.deleteCarContract(+this.selectedOption,Id).subscribe(res => {
      this.datasource.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.datasource);
      this.UpdatePlanning(this.datasource);
     
      })
   }
   adjustContract(data): void {
    const dialogRef = this.dialog.open(PaymentlogComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'adjust',            
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if ( !result )
              {
                  return;
              }
              this.translateService.get(['NAV.ContractAdjust'])
           .subscribe(data => { this.data = data });
      this._borrowedRentalService.adjustContract(+this.selectedOption,data.Id,result).subscribe((data: any[])=>{ 
          this._snackBar.open(this.data ["NAV.ContractAdjust"], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
          
        });
    })
  }
   
/**
     * renouveler BorrowedRentalCarContract
     */
    renouveler(element): void{
      const dialogRef = this.dialog.open(RenewContactComponent,{
        panelClass: 'custom-dialog-container',
        data:{
          element: element
          }
      });
  
  
      dialogRef.afterClosed().subscribe((result) => {
           
        if ( !result )
                {
                    return;
                }
                this.translateService.get(['NAV.ContractRenew'])
                .subscribe(data => { this.data = data }); 
        this._borrowedRentalService.confirmBorrowedRuntedEndOrRenewContractImplementation(+this.selectedOption, element.Id, result).subscribe((data: any[]) => { 
         
        this._snackBar.open(this.data ["NAV.ContractRenew"], 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
          });
          }); 
        
      });
    }
   
    applyfilter(){
      this.dataSource.filter = this.searchkey.trim().toLowerCase();
    }
    onfilterClear(){
      this.searchkey = '';
    }
    downloadPdf() {
      var prepare=[];
      this.datasource.forEach(e=>{
        var tempObj =[];
        tempObj.push(e.ContractTypeString);
        tempObj.push(formatDate(e.ContractStartDate,'dd/MM/yyyy', 'fr'));
        tempObj.push(formatDate(e.ContractEndDate,'dd/MM/yyyy', 'fr'));
        tempObj.push(e.RecurringCost);
        tempObj.push(e.FirstDriverString);
        tempObj.push(e.ContractRef);
        tempObj.push(e.WarnMeBeforeNDay);
        tempObj.push(e.SecondDriverString);
        tempObj.push(e.GazFuelLevelPercent);
        tempObj.push(e.Cost);
        prepare.push(tempObj);
      });
      const doc = new jsPDF();
      doc.text('Liste des contrats', 78, 16); //default
      
      doc.autoTable({
          head: [['Type de contrat','Date début du contrat','Date fin du contrat',"Coût d'activation",'Premier chauffeur','Réf','Rappel','Deuxième chauffeur','Niveau de carburant','Coût']],
          body: prepare,
          startY: 20


      });
      doc.save('Liste_des_contats' + '.pdf');
    } 
    exportExcel(){
      var prepare_to_excel=[];
      let tem =[];
      tem.push('Type de contrat');
      tem.push('Date début du contrat');
      tem.push('Date fin du contrat');
      tem.push("Coût d'activation");
      tem.push('Premier chauffeur');
      tem.push('Réf');
      tem.push('Rappel');
      tem.push('Deuxième chauffeur');
      tem.push('Niveau de carburant');
      tem.push('Coût');
      prepare_to_excel.push(tem);
      this.datasource.forEach(e=>{
        var tempObj =[];
        tempObj.push(e.ContractTypeString);
        tempObj.push(e.ContractStartDate);
        tempObj.push(e.ContractEndDate);
        tempObj.push(e.RecurringCost);
        tempObj.push(e.FirstDriverString);
        tempObj.push(e.ContractRef);
        tempObj.push(e.WarnMeBeforeNDay);
        tempObj.push(e.SecondDriverString);
        tempObj.push(e.GazFuelLevelPercent);
        tempObj.push(e.Cost);
        prepare_to_excel.push(tempObj);
      });
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      XLSX.writeFile(workbook, 'Liste_des_contrats.xls', { bookType: 'xls', type: 'buffer' });
   }
   navigate(data) {
    //initialize values to send
    this.trackingObject = +this.selectedOption;
    this.ContractId = +data.Id;
    this.ContractTypeString = data.ContractTypeString;
    this.trackingObjects.forEach(e=>{
        if(e.Key.toString() == this.trackingObject){
          this.CarMatricule = e.FullName;
        }
      });
   
   
    this.router.navigate([
      '/parc/borrowedcar/invoice/' +   this.trackingObject.valueOf() + '/' + this.ContractId.valueOf()+'/' + this.CarMatricule .valueOf()+'/' + this.ContractTypeString.valueOf()
     
    ]);
  }
navigatetoplanning() {
    //initialize values to send
    this.trackingObject = +this.selectedOption;
    this.trackingObjects.forEach(e=>{
      if(e.Key.toString() == this.trackingObject){
        this.CarMatricule = e.FullName;
      }
    });
 
   
    this.router.navigate([
      '/parc/borrowedcar/planning/' +   this.trackingObject.valueOf() +'/' + this.CarMatricule .valueOf()
     
    ]);
  }
  // tslint:disable-next-line: typedef
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    
    switch(tabChangeEvent.index){
    case 0 :
         this.disabled = false;
         this.currentTab = 0;
         break;
    case 1 :
         this.disabled = true;
         this.currentTab = 1;
         break;}
}
updatetable(){
    if (this.currentTab === 0)
    {this.disabled = false; }
    BorrowedModel.calender = [];

    this._borrowedRentalService.getBorrowedRentalCarContract(+this.selectedOption).subscribe((data) => {
      // tslint:disable-next-line: forin
      this.result = data[Object.keys(data)[0]];
      this.dataSource  = new MatTableDataSource(data[Object.keys(data)[0]]);
      this.contracts = [];
      this.result.forEach(elt => {
        this.contracts.push(new BorrowedModel(elt));
      })

     

      
    
      this.datasource = this.contracts;
      this.dataSource = new MatTableDataSource(this.contracts);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.UpdatePlanning(this.result);
    }); 
    
     
 
  }
  UpdatePlanning(result: any[]) {
    this.planning = [];
    result.forEach(elt => {
      this.planning.push(new PlanningModel(elt));
     
    })
   
    BorrowedModel.calender =  this.planning;  }

ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}



 


