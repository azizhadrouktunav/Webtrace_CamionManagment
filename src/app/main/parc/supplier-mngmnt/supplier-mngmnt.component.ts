import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { SupplierService } from './supplier.service';
import { Supplier } from './model';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import { locale as french } from '../i18n/fr';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'supplier-mngmnt',
  templateUrl: './supplier-mngmnt.component.html',
  styleUrls: ['./supplier-mngmnt.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class SupplierMngmntComponent implements OnInit , OnDestroy , AfterViewInit {
  
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  suppliers: Supplier[] = []
  displayedColumns: string[] = ['supplier', 'name', 'description', 'address', 'phone', 'email', 'responsible_name1', 'responsible_name2', 'webSite', 'maximum_budget', 'date_entered', 'actions' ];
  dataSource:MatTableDataSource<Supplier>
  dialogRef: any;
  isDisabledDelete = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, null) sort: MatSort;
  @ViewChild('filter', {static: true}) filter: ElementRef;
  // Private
  private _unsubscribeAll: Subject<any>;
  translations: any;
  constructor(
    private _supplierService : SupplierService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private _fuseTranslationLoaderService : FuseTranslationLoaderService,
    private _translateService: TranslateService
  ) {
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
    this.dataSource = new MatTableDataSource<Supplier>(this.suppliers);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  
    this.suppliers = this._supplierService.suppliers.map(item => {
           return new Supplier(item)
    })
    this.dataSource.data = this.suppliers;
    fromEvent(this.filter.nativeElement, 'keyup')
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(150),
        distinctUntilChanged()
    )
    .subscribe(() => {
        if ( !this.dataSource )
        {
            return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
    });
   
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
  /**delete supplier**/
  delete(supplier: Supplier):void
  {
   
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
  });
  this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

  this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
          this._supplierService.delete(supplier.ID).subscribe(data => {
               if(data === true){
                this.dataSource.data = this.dataSource.data.filter((value, key) => {
                  return value.ID != supplier.ID;
                });
                 // Show the success message
                 this._matSnackBar.open('Supplier is deleted', 'OK', {
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
  /**
   * add supplier**/
  add():void
  {
    this.dialogRef = this._matDialog.open(SupplierFormComponent, {
      panelClass: ['event-form-dialog'] ,
      data : {
        action: 'new'     
      }
    });
    this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
        if ( !response )
        {
            return;
        }
        const newSupplier = response.getRawValue();
        this._supplierService.addOrUpdate(true, newSupplier)
        .subscribe(value => {
          if(value){
            
            this.dataSource.data.unshift(value);
            this.dataSource.data =  this.dataSource.data;
            //this.table.renderRows();
            this._matSnackBar.open(value.Name + ' is added ', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
              }
           },
           error => {
            console.info(error);
          })
        })

}
  /**
   * edit supplier**/
  edit(action: string, supplier:Supplier): void{
    const Index = this.dataSource.data.indexOf(supplier);
    this.dialogRef = this._matDialog.open(SupplierFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
        supplier : supplier,
        action : action
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
                  this._supplierService.addOrUpdate(false,formData.getRawValue()).subscribe(data => {
                    if(data){
                       Object.assign(this.dataSource.data[Index], data);
                    }
                  },
                  error => {
                    console.info(error);

                  },
                  () => {
                      // Show the success message
                      this._matSnackBar.open('Supplier is edited', 'OK', {
                        // here specify the position
                        verticalPosition: 'bottom',
                        horizontalPosition: 'right',
                        duration        : 2000
                        });
                  })
                  break;
              /**
               * Delete
               */
              case 'delete':

                  this.delete(supplier);
                  break;
          }
      });  
  }
  downloadPdf(){
    this._translateService.get(['NAV.Supplier','NAV.Name','NAV.Description','NAV.Address','NAV.Phone','NAV.email','responsible_1','responsible_2','website','EntryDate', 'maximum_budget']).subscribe(translations  => {

      this.translations = translations;
    });
    var prepare=[];
    this.suppliers.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.supplierString)
      tempObj.push(e.Name);
      tempObj.push(e.Responsible1Name);
      tempObj.push(e.Responsible2Name);
      tempObj.push(e.Phone);
      tempObj.push(e.Mail);
      tempObj.push(e.Description);
      tempObj.push(e.WebSite);
      tempObj.push(e.MaxBudget);
      tempObj.push(e.SaveDate.toISOString().slice(0,10));
      prepare.push(tempObj);
    });
    var doc = new jsPDF( {orientation: "landscape",});
    doc.text('Liste des fournisseurs', 40, 16); //default
    doc.autoTable({
        head: [[this.translations["NAV.Supplier"],this.translations["NAV.Name"],this.translations["responsible_1"],this.translations["responsible_2"],this.translations["Phone"],this.translations["NAV.email"],this.translations["NAV.Description"],this.translations["website"], this.translations["maximum_budget"],this.translations["EntryDate"]]],
        body: prepare,
        startY: 35
    });
    doc.save('Fournisseurs.pdf');
  }
  downloadExcel(){
    this._translateService.get(['NAV.Supplier','NAV.Name','NAV.Description','NAV.Address','NAV.Phone','NAV.email','responsible_1','responsible_2','website','EntryDate', 'maximum_budget']).subscribe(translations  => {

      this.translations = translations;
    });
      var prepare_to_excel=[[ this.translations["NAV.Supplier"],this.translations["NAV.Name"],this.translations["responsible_1"],this.translations["responsible_2"],this.translations["Phone"],this.translations["NAV.email"],this.translations["NAV.Description"],this.translations["website"], this.translations["maximum_budget"],this.translations["EntryDate"]]];
      this.suppliers.forEach(e=>{
        var tempObj =[];
      tempObj.push(e.supplierString);
      tempObj.push(e.Name);
      tempObj.push(e.Responsible1Name);
      tempObj.push(e.Responsible2Name);
      tempObj.push(e.Phone);
      tempObj.push(e.Mail);
      tempObj.push(e.Description);
      tempObj.push(e.WebSite);
      tempObj.push(e.MaxBudget);
      tempObj.push(e.SaveDate.toISOString().slice(0,10));
        prepare_to_excel.push(tempObj);
      });
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      XLSX.writeFile(workbook, 'Fournisseurs.xls', { bookType: 'xls', type: 'buffer' });
  }
}
