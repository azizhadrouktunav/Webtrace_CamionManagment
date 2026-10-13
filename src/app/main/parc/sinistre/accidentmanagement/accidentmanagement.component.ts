
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../../i18n/en';
import { locale as french } from '../../i18n/fr';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar, MatDialog, MatTabChangeEvent } from '@angular/material';
innerHeight
import * as jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Router } from '@angular/router';

import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Observable, Subject } from 'rxjs';
import { BorrowedModel } from '../../interfaces/borrowedrentalModel';
import { AccidentdetailsService } from '../../services/accidentdetails.service';
import { DatacService } from '../../services/datac.service';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { AccidentDetailsExtended } from '../../interfaces/accidentdetails';
import { AddEditsinistreComponent } from '../../Dialogs/add-editsinistre/add-editsinistre.component';
import * as _ from 'lodash';
import { environment } from 'environments/environment';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { saveAs } from 'file-saver';
import { FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

export interface file {
  url: string;
  name: string;
}

@Component({
  selector: 'app-accidentmanagement',
  templateUrl: './accidentmanagement.component.html',
  styleUrls: ['./accidentmanagement.component.scss']
})

export class AccidentmanagementComponent implements OnInit {
  private _unsubscribeAll: Subject<any>;
  selectedOption: string;
  datasource: any = [];
  dataSource = new MatTableDataSource<BorrowedModel>();
  disabled = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, null) paginator: MatPaginator;
  searchkey: string;
  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;


  files: file[] = [

  ];
  tableColumns = ['StatusString', 'AccidentTypeString', 'AccidentDateGMT', 'AccidentLocationFullName', 'Dammage', 'actions'];
  AccidentdetailsParam: any;
  DriverList: any[] = [];
  trackingObjects: any[] = [];
  data: any[];
  accidentdetails: any[];
  trackingObject: number;
  accidentReportRef: number;
  CarMatricule: any;
  PlaceList: any[];
  placeString: any;
  CurrentCustomer: number;
  accidentId: number;
  fileUrl;
  filename = null;
  fileName: any;
  assurances: any[] = [];
  isDisabledDelete = true;
  vehicules = this.fb.group({
    cars: ['']
  });
  filteredOptions: Observable<string[]>;

  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _accidentdetailsService: AccidentdetailsService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private dataService: DatacService,
    private _fuseSidebarService: FuseSidebarService,
    private errorHandler: ErrorHandlerService,
    private fb: FormBuilder,

  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, french);
    this._unsubscribeAll = new Subject();

  }

  ngOnInit() {

    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;

    this._accidentdetailsService.getAccidentdetailsParam().subscribe((result:any) => {
      if(result != null)
     { 
      this.AccidentdetailsParam = result;
     if(this.AccidentdetailsParam.DicoDriverElement!= null)
     {
      this.DriverList = json2array(this.AccidentdetailsParam.DicoDriverElement);
     }
      if(this.AccidentdetailsParam.DicoTrackingObjects != null)
         this.trackingObjects = json2array(this.AccidentdetailsParam.DicoTrackingObjects);
        if(this.AccidentdetailsParam.DicoPlaceElementsCurrentCustomer != null)
            this.PlaceList = json2array(this.AccidentdetailsParam.DicoPlaceElementsCurrentCustomer);
      if(this.AccidentdetailsParam.CurrentAccount != null)
            this.CurrentCustomer = json2array(this.AccidentdetailsParam.CurrentAccount)[9].Id;
     if(this.AccidentdetailsParam.Assurances!= null)
      this.assurances = json2array(this.AccidentdetailsParam.Assurances);
      BorrowedModel.DriverList = this.DriverList;
     
      this.filteredOptions = this.vehicules.get('cars').valueChanges
      .pipe(
        startWith(''),
        map(value => value ? this._filter(value): this.trackingObjects.slice())
      );
      // make this.vehicules.get('cars') to be the default value
      //this.vehicules.get('cars').setValue(this.trackingObjects[0].Key);
      
      
      
      }

      else{
        this._snackBar.open('Server is Not Responding', 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
          });
      }
          
    }),
    (error) => {
      if(error.error == "Session was terminated")
        {
          this._snackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this.router.navigate(['app-auth']);
          });
        } 

        else{
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
    }
    


    this.dataService.fetchParams().subscribe(params => {
      this.trackingObject = params.trackingObject;
      this.selectedOption = '' + params.trackingObject;
    });
    if (this.selectedOption != "undefined") {

      this.updatetable();
    }

  }
  displayFn = (car) => {
    if(car != null && car!='' && this.trackingObjects.length){
      let found = this.trackingObjects.find(x => x.Key === car);
      if(found)
        return found.FullName;
    }
    return '';
    //? driver.Name : '';
  }
  private _filter(value: string): string[]{
    if(value.length > 1) {
      const filterValue = value.toLowerCase();
      
      
      let results =  this.trackingObjects.filter(option => option.FullName.toLowerCase().includes(filterValue));
      return results
    }else{
      return this.trackingObjects;
    }
  }

  navigate(data) {
    //initialize values to send
    this.trackingObject = +this.selectedOption;
    this.accidentReportRef = data.AccidentReportRef;
    this.trackingObjects.forEach(e => {
      if (e.Key.toString() == this.trackingObject) {
        this.CarMatricule = e.FullName;
      }
    });


    this.router.navigate([
      '/parc/sinistre/accident/' + this.trackingObject.valueOf() + '/' + this.accidentReportRef.valueOf() + '/' + this.CarMatricule.valueOf()

    ]);
  }
  navigatemaintenaces(data) {
    
    //initialize values to send
    this.trackingObject = +this.selectedOption;
    this.accidentId = +data.Id;
    this.trackingObjects.forEach(e => {
      if (e.Key.toString() == this.trackingObject) {
        this.CarMatricule = e.FullName;
      }
    });
    this.router.navigate([
      '/parc/sinistre/maintenance/' + this.trackingObject.valueOf() + '/' + this.accidentId.valueOf() + '/' + this.CarMatricule.valueOf()

    ]);


  }

  applyfilter() {
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }

  public trackByFn(index, item) {
    if (!item) return null;
    return item.id;
  }
  download(fileurl, filename) {

    this._accidentdetailsService
      .download(fileurl)
      .subscribe(blob => saveAs(blob, filename))
  }
  downloadPdf() {
    var prepare = [];
    this.accidentdetails.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StatusString);
      tempObj.push(e.AccidentTypeString);
      tempObj.push(e.AccidentDateGMT);
      tempObj.push(e.AccidentLocationFullName);
      tempObj.push(e.Dammage);
      tempObj.push(e.DriverString);
      tempObj.push(e.InsurerNameAstring);

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des accidents', 78, 16); //default
    doc.autoTable({
      head: [['Status', "Type d'accident", "Date d'accident", "Emplacement", 'Description', 'Chauffeur', 'Véhicule assuré par']],
      body: prepare,
      startY: 20


    });
    doc.save('AccidentDetails_List' + '.pdf');
  }
  exportExcel() {
    var prepare_to_excel = [];
    let tem = [];
    tem.push('Status');
    tem.push("Type d'accident");
    tem.push("Date d'accident");
    tem.push("Emplacement");
    tem.push('Description');
    tem.push('Chauffeur');
    tem.push('Véhicule assuré par');

    prepare_to_excel.push(tem);
    this.accidentdetails.forEach(e => {
      var tempObj = [];
      tempObj.push(e.StatusString);
      tempObj.push(e.AccidentTypeString);
      tempObj.push(e.AccidentDateGMT);
      tempObj.push(e.AccidentLocationFullName);
      tempObj.push(e.Dammage);
      tempObj.push(e.DriverString);
      tempObj.push(e.InsurerNameAstring);

      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'AccidentDetails_List.xls', { bookType: 'xls', type: 'buffer' });
  }
  selected(event) {
   
    
    this.selectedOption = event.value;
    this.updatetable();
  }
  updatetable() {

    this.disabled = false;
    this._accidentdetailsService.getAccidentdetails(+this.selectedOption).subscribe((result) => {
     // this.data = json2array(result);
      this.accidentdetails = [];
     /* this.data.forEach(elt => {
        this.accidentdetails.push(new AccidentDetailsExtended(elt));
      })*/
      this.accidentdetails =  json2array(result);
      this.dataSource = new MatTableDataSource(this.accidentdetails);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    },
      (error: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);
        console.log(error.name + ' ' + error.message);
      });

  }
  openaccidentdetailDialog() {
    const dialogRef = this.dialog.open(AddEditsinistreComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'add',
        assurances: this.assurances
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if(result.data.AccidentLocationFullName != "-1")
           this.placeString = _.find(this.PlaceList, { key: result.data.AccidentLocationFullName }).NamePlace;
      //this.placeString = _.find(this.PlaceList, { key: result.data.AccidentLocationFullName }).NamePlace;

      if (result.files1 != undefined) {
        result.files1.forEach((value) => {

          this.filename = this.filename + ';/ClientImage/' + this.CurrentCustomer + '/AccidentManager/' + value.name;
        });
      }
      else {
        this.filename = null;
      }
      if (this.filename != null) {

        this.filename = this.filename.substr(1);
      }
      this._accidentdetailsService.addAccidentDetails(+this.selectedOption, -1, this.placeString, result.data, this.filename).subscribe((data: any[]) => {

        this.accidentdetails.push(new AccidentDetailsExtended(data));
        this.dataSource = new MatTableDataSource(this.accidentdetails);

        this._snackBar.open('Accident Report is added ', '', {
          duration: 5000,
          // here specify the position
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });

      },
      (error) => {
        if (error.error == "Session was terminated") {
          this._snackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(() => {
            this.router.navigate(['app-auth']);
          });
        }
        else{
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
      }
        
    );
  })}

  editaccidentdetails(details) {
    const dialogRef = this.dialog.open(AddEditsinistreComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'edit',
        data: details,
        type: details.AccidentType,
        assurances: this.assurances
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      if(result.data.AccidentLocationFullName != "-1")
           this.placeString = _.find(this.PlaceList, { key: result.data.AccidentLocationFullName }).NamePlace;
      if (result.files1 != undefined) {
        result.files1.forEach((value) => {

          this.filename = this.filename + ';/ClientImage/' + this.CurrentCustomer + '/AccidentManager/' + value.name;
        });
      }
      else {
        this.filename = null;
      }
      if (this.filename != null) {

        this.filename = this.filename.substr(1);
      }
      this._accidentdetailsService.addAccidentDetails(+this.selectedOption, details.Id, this.placeString, result.data, this.filename).subscribe((data: any[]) => {
        
        if(data != null)
        {var index = this.accidentdetails.map(x => { return x.Id }).indexOf(details.Id);

        this.accidentdetails.splice(index, 1, new AccidentDetailsExtended(data));


        this.dataSource = new MatTableDataSource(this.accidentdetails);

        this._snackBar.open('Accident Report is updated ', 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
          });}

        else{
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }

      

         

      },
      
      
      (error) => {
        if (error.error == "Session was terminated") {
          this._snackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(() => {
            this.router.navigate(['app-auth']);
          });
        }
        else{
          this._snackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
      }
        
    );
  })}

  deleteItem(element): void {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    dialogRef.componentInstance.confirmMessage = 'deleteMsg';
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteReport(element.Id);
        
      }

    
    },
   
    )}
  deleteReport(Id) {
    var index = this.accidentdetails.map(x => { return x.Id }).indexOf(Id);
    this._accidentdetailsService.deleteReport(+this.selectedOption, Id).subscribe(res => {
      
      {this.accidentdetails.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.accidentdetails);
    
      this._snackBar.open('Le rapport est supprimée', 
      'OK', {
        // here specify the position
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        duration        : 2000
        });}

      

      

    }
    ,
    (error) => {
      if (error.error == "Session was terminated") {
        this._snackBar.open("votre session est expirée!", "s'identifier", {
          duration: 10000
        }).afterDismissed().subscribe(() => {
          this.router.navigate(['app-auth']);
        });
      }
      else{
        this._snackBar.open('Server is Not Responding', 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          duration        : 2000
          });
      }
    ;
  }
    )


  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  toggleSidebar(name, data): void {
    // tslint:disable-next-line: one-variable-per-declaration
    var attachements = data.Attachment.split(";"),
      i;
    this.files = [];
    for (i = 0; i < attachements.length; i++) {
      this.fileUrl = environment.iconUrl.slice(0,-1) + attachements[i];

      this.fileName = attachements[i].split('/')[4];
      if (this.fileName != undefined) {
        this.files.push({ 'url': this.fileUrl, 'name': this.fileName })
      }
    }

    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

}