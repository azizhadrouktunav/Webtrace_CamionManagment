import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BeneficiaryService } from './beneficiary.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Beneficiary } from './model';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef, MatSnackBar, MatTable } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BeneficiaryFormComponent } from './beneficiary-form/beneficiary-form.component';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TableUtil } from './table-util';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import { locale as french } from '../i18n/fr';
import { DateMoreThan } from 'app/main/helpers/compareDate';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { json2array } from 'app/main/helpers/must-match.validator';
@Component({
  selector: 'app-beneficiary-management',
  templateUrl: './beneficiary-management.component.html',
  styleUrls: ['./beneficiary-management.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class BeneficiaryManagementComponent implements OnInit, OnDestroy, AfterViewInit  {
  
  //Error Display
error:any={isError:false,errorMessage:''};
isValidDate:any;
beneficiary:any
public showSeconds = true
today : Date = new Date();
end:Date = new Date();
start:Date = new Date();
dateForm: FormGroup;
dataSource:MatTableDataSource<Beneficiary>;
beneficiaries =[]
dialogRef: any;
searchkey;
color;
touchUi;
showSpinners;
stepHour;
stepMinute;
stepSecond;
disabled;

confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
displayedColumns = ['Name', 'Adresse', 'Email', 'Telephone', 'Web', 'Creation_date', 'actions']
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, null) sort: MatSort;
@ViewChild('TABLE',{static:true}) export: ElementRef;
isDisabledDelete = true;
ListDriver:any[]
ListTracking:any[]
departments:any[] = []
ListAccount:any[]
IdCustomer:number
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(private _beneficiaryService:BeneficiaryService,
    private formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) { 

    
    // Load the translations
    this._fuseTranslationLoaderService.loadTranslations(english, french , arabic);

     // Set the private defaults
     this._unsubscribeAll = new Subject();
    
  }

  ngOnInit() {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    this._beneficiaryService.getBenefManagementParam()
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.ListDriver = data.ListDriver
      this.ListAccount = data.ListAccount
      this.ListTracking = data.ListTracking 
      this.departments = json2array(data.ListDepartment)
      this.IdCustomer = data.CustomerBenef.Id
   },
   err => console.log(err)
    ); 
   
    
    

    this._beneficiaryService.getBenefaciaries();
    this._beneficiaryService.onBeneficiariesChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.beneficiaries = data;
     this.dataSource = new MatTableDataSource(data);
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
   /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
  /*onSubmit(){
    //this.start.setMonth(this.start.getMonth() - 3)
   // this.isValidDate = this.validateDates(this.dateForm.controls['start'].value, this.dateForm.controls['end'].value)
   if(this.dateForm.valid) {
    this._beneficiaryService.getBenefaciaries(this.dateForm.controls['start'].value, this.dateForm.controls['end'].value);
    // .subscribe(data => {
    //     this.dataSource.data = data
    //   },
    //   err => {
    //     console.log(err)
    //   })
   }
  }*/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  // validateDates(sDate: Date, eDate: Date){
  //   this.isValidDate = true;
  //   if((sDate == null || eDate ==null)){
  //    // this.error={isError:true,errorMessage:'Start date and end date are required.'};
  //     this.isValidDate = false;
  //   }

  //   if((sDate != null && eDate !=null) && (eDate) < (sDate)){
  //     this.error={isError:true,errorMessage:'End date should be grater then start date.'};
  //     this.isValidDate = false;
  //   }
  //   return this.isValidDate;
  // }
  delete(beneficiary: Beneficiary):void
  { 
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
  });
  this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

  this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
          this._beneficiaryService.delete(beneficiary.ID).subscribe(data => {
               if(data == true){
                this.dataSource.data = this.dataSource.data.filter((value,key)=>{
                  return value.ID != beneficiary.ID;
                });
                 // Show the success message
                 this._matSnackBar.open('Beneficiary is deleted', 'OK', {
                   // here specify the position
                   verticalPosition: 'bottom',
                   horizontalPosition: 'right' ,
                   duration  : 2000
                    })
                }
               else {
                // Show the failure message
            this._matSnackBar.open('Server not responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
           }
          },
          error => {
                alert(error)
          });
      }
      this.confirmDialogRef = null;
  });
  }

  edit(action: string, beneficiary:Beneficiary): void{
    const Index = this.dataSource.data.indexOf(beneficiary);
    this.dialogRef = this._matDialog.open(BeneficiaryFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
        beneficiary : beneficiary,
        action: action,
        ListDriver: this.ListDriver,
        ListAccount:this.ListAccount,
        ListTracking : this.ListTracking, 
        departments : this.departments,
        IdCustomer : this.IdCustomer,
      }
  });
  this.dialogRef.afterClosed()
      .subscribe(response => {
          if ( !response )
          {
              return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch ( actionType )
          {
              /**
               * Save
               */
              case 'save':
                
                  this._beneficiaryService.addOrUpdateBeneficiary(formData.getRawValue(), beneficiary.ID).subscribe(data => {
                    if(data){
                      const Index = this.dataSource.data.indexOf(beneficiary);
                    this.dataSource.data[Index] = Object.assign(this.dataSource.data[Index], data);
                       // Show the success message
                        this._matSnackBar.open('Beneficiary is updated', 'OK', {
                      // here specify the position
                      verticalPosition: 'bottom',
                      horizontalPosition: 'right' ,
                      duration  : 2000
                      })
                    }
                  },
                  error => {
                    
                     // Show the failure message
                     this._matSnackBar.open('Server is Not Responding', 'OK', {
                      // here specify the position
                      verticalPosition: 'bottom',
                      horizontalPosition: 'right' ,
                      duration  : 2000
                      })

                  })
                  break;
              /**
               * Delete
               */
              case 'delete':

                  this.delete(beneficiary);
                  break;
          }
      });  
  }
  // add Beneficiary
  add():void
  {
    this.dialogRef = this._matDialog.open(BeneficiaryFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'] ,
      data : {
        action: 'new',
        ListDriver: this.ListDriver,
        ListAccount:this.ListAccount,
        ListTracking : this.ListTracking, 
        departments : this.departments,
        IdCustomer : this.IdCustomer,     
      }
    });
    this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
        if ( !response )
        {
            return;
        }
        const newBeneficiary = response.getRawValue();
        
        this._beneficiaryService.addOrUpdateBeneficiary(newBeneficiary)
        .subscribe((benef : Beneficiary) => {
          if(benef){
           // var benef = new Beneficiary(value)
            this.dataSource.data.unshift(benef);
            this.dataSource.data =  this.dataSource.data;
           // this.table.renderRows();
            this._matSnackBar.open(benef.FirstName + ' is added ', '' , {
              duration: 5000,
               // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right'
            });
              }
           },
           error => {
            console.info(error);
          })
        })

}
downloadPdf():void {
  var now = (new Date()).toLocaleString();
  var prepare = []
  this.beneficiaries.forEach(item => {
    var tempObj = []
    tempObj.push(item.FirstName)
    tempObj.push(item.Adresse)
    tempObj.push(item.Email)
    tempObj.push(item.Telephone)
    tempObj.push(item.Web)
   // tempObj.push(item.SaveDate)
    prepare.push(tempObj);
  });
  const doc = new jsPDF();
  doc.text('Liste des clients', 78, 16); //default
  doc.autoTable({
      head: [['Nom','Adresse','Email','Telephone','Web' ]],
      body: prepare,
      startY: 20
  });
  doc.save('Clients_List(' + now + ').pdf');
}
exportTable(){
  var fileName = 'Clients_List(' + (new Date()).toLocaleString() + ').xls'
  var prepare_to_excel=[];
  let tem = ['Nom','Adresse','Email','Telephone','Web' ];
  prepare_to_excel.push(tem);
  this.beneficiaries.forEach(item =>{
    var tempObj =[];
    tempObj.push(item.FirstName)
    tempObj.push(item.Adresse)
    tempObj.push(item.Email)
    tempObj.push(item.Telephone)
    tempObj.push(item.Web)
   // tempObj.push(item.SaveDate)
    prepare_to_excel.push(tempObj);
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, fileName, { bookType: 'xls', type: 'buffer' });
}
}
