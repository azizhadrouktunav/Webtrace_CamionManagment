import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { ResizeEvent } from 'angular-resizable-element';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
import { TranslateService } from '@ngx-translate/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import {UserOptions} from 'jspdf-autotable';
import * as XLSX from 'xlsx';  
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { json2array } from  'app/main/helpers/must-match.validator';
import { Subject } from 'rxjs/internal/Subject';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { takeUntil } from 'rxjs/internal/operators';
import { DriverFormDialogComponent } from './driver-form-dialog/driver-form-dialog.component';
import { FormGroup } from '@angular/forms';
import { GetionChauffeursService } from './getion-chauffeurs.service';
import { isNullOrUndefined } from 'util';
import { ErrorDialogComponent } from '../Dialogs/error-dialog/error-dialog.component';
import { ListCarComponent } from './list-car/list-car.component';

@Component({
  selector: 'app-gestion-des-chauffeurs',
  templateUrl: './gestion-des-chauffeurs.component.html',
  styleUrls: ['./gestion-des-chauffeurs.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),fuseAnimations
  ],
})
export class GestionDesChauffeursComponent implements OnInit {
  public style: object = {};
  leftPosition:any='';
  topPosition:any='';
  divWidth:any='';
  divHeight:any='';
  displayedColumns: string[] = ['Nfamille','Prenom','Etat','Departemant','Code_personnel','Email','ntel','CIN','N_permis','Current_car','actions'];//,'Code_personnel','Email','ntel','CIN','N_permis','Current_car',
  
  //,'Seal','Unseal',
  dataSource: MatTableDataSource<any>;  
  disabled;
  driverList: any;
  private _unsubscribeAll: Subject<any>;
  dialogRef: any;
  isCommandListVisible=false;
  isPanelOpenned=false;
  isDisabledDelete = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator,{static : true}) paginator: MatPaginator;
  searchkey: string;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  deleteResponse : Object = {
    RemoveDriverResult : Boolean
  }
  constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _getionChauffeursService: GetionChauffeursService, private _matDialog: MatDialog,private _matSnackBar : MatSnackBar,) {
     this._fuseTranslationLoaderService.loadTranslations(english, french, arab); 
     // Set the private defaults
     this._unsubscribeAll = new Subject();
    }
  ngOnInit() {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    this._getionChauffeursService.onDriversChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
   });
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

  onfilterClear(){
    this.searchkey = "";
  }
  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  openCommandList(){
    this.isCommandListVisible=true;
  }
  onResizeEnd(event: ResizeEvent): void {
    this.leftPosition = event.rectangle.left;
    this.topPosition = event.rectangle.top;
    this.divWidth = event.rectangle.width;
    this.divHeight = event.rectangle.height;
    this.style = {
        position: 'fixed',
        left: `${this.leftPosition}px`,
        top: `${this.topPosition}px`,
        width: `${this.divWidth}px`,
        height: `${this.divHeight}px`
      };
  }
  
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit driver
     *
     * @param driver
     */
  editDriver(driver): void{
   
    this.dialogRef = this._matDialog.open(DriverFormDialogComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          driver: driver,
          action: 'edit',
          departments: this._getionChauffeursService.departments
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

                this._getionChauffeursService.updateDriver(formData.getRawValue());
                 /*  this._getionChauffeursService.onDriversChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe( data => {
          this.dataSource = new MatTableDataSource(data);
      });*/
      //  this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;

                break;
            /**
             * Delete
             */
            case 'delete':

                this.delete(driver);

                break;
        }
    });
  }
  LstCar(driver): void{
   if(driver.DriverCode=="")
   {
    this._matSnackBar.open("Définissez tout d'abord un code personnel pour ce chauffeur!", 'error', {
      // here specify the position
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      duration        : 2000
      });
  }
   
   else
   {
    this.dialogRef = this._matDialog.open(ListCarComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          driver: driver,
          action: 'edit',
          departments: this._getionChauffeursService.departments,
          equipements : this._getionChauffeursService.equipements
      }
    });
  }
    this.dialogRef.afterClosed()
    .subscribe((response:any) => {
        if ( !response )
        {
            return;
        }
        else
        {
          response.forEach(row =>{
            this._getionChauffeursService.UpdateCarsCanDriveTheDriver(row.keyDriver,row.EtatConduite,row.KeyTO).subscribe((data:any) => {
              this.isCommandListVisible=true;
             });

          })

        
        }
       
    });
  }
  hideCommdListTable()
  {
    this.isCommandListVisible=false;
  }
  addDriver():void{
    this.dialogRef = this._matDialog.open(DriverFormDialogComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          action: 'new',
          departments: this._getionChauffeursService.departments
      }
  });

  this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
          if ( !response )
          {
              return;
          }
          let newDriver = response.getRawValue();
          this._getionChauffeursService.addDriver(newDriver);
      });
  }
  delete(driver){
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
      });
  
  this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';
  
  this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this._getionChauffeursService.deleteDriver(driver);
      }
      this.confirmDialogRef = null;
  });
  }
  downloadPdf(){
    var prepare=[];
    this._getionChauffeursService.drivers.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.FullName);
      tempObj.push(e.DepartmentString);
      tempObj.push(e.CIN);
      tempObj.push(e.DriverCode);
      tempObj.push(e.Email);
      tempObj.push(e.Tel);
      tempObj.push(e.DriverLicenseNumber);
      tempObj.push(e.CurrentTransportationName);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des chauffeurs', 78, 16); //default
    doc.autoTable({
        head: [['Nom','Départemant','CIN','Code personnel','Email','Tel','Permit','Vehicule util']],
        body: prepare,
        startY: 20
    });
    doc.save('DriverList.pdf');
  }
  exportExcel(){
    var prepare_to_excel=[];
    let tem =[];
    tem.push('Nom Complet');
    tem.push('Nom de Département');
    tem.push('Code personnel');
    tem.push('Email');
    tem.push('Tel');
    tem.push('Permit');
    tem.push('Vehicule util');
    prepare_to_excel.push(tem);
    this._getionChauffeursService.drivers.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.FullName);
      tempObj.push(e.DepartmentString);
      tempObj.push(e.CIN);
      tempObj.push(e.DriverCode);
      tempObj.push(e.Email);
      tempObj.push(e.Tel);
      tempObj.push(e.DriverLicenseNumber);
      tempObj.push(e.CurrentTransportationName);
    
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Liste_driver.xls', { bookType: 'xls', type: 'buffer' });
  }
 
}


