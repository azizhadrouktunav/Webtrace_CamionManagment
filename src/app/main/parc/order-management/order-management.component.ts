import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from './service.order';
import { MatPaginator, MatSort, MatDialogRef, MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { Mission } from './model';
import { fuseAnimations } from '@fuse/animations';
import { isNullOrUndefined } from 'util';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { VerifyStatusDialogComponent } from './verify-status-dialog/verify-status-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import { locale as french } from '../i18n/fr';
import { FuseUtils } from '@fuse/utils';
import { DataSource } from '@angular/cdk/collections';
import {fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ActivatedRoute, Router } from '@angular/router';
import { decrypt } from '../Parc';
@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class OrderManagementComponent implements OnInit  {
// Error Display
error:any={isError:false,errorMessage:''};
isValidDate:any;
today = new Date();
dateRangeForm: FormGroup;
// datatable
displayedColumns = ['number','status', 'immatriculation', 'responsable' ,'purpose',  'starting', 'sDate', 'destination' , 'eDate', 'compagnie', 'cost' , 'actions'];
//dataSource: FilesDataSource | null;
dataSource: MatTableDataSource<Mission>;
missions:Mission[] = [];
drivers:any;
cars:any;
places:any;
carList:any;
dialogRef: any;
searchkey;
confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

@ViewChild(MatPaginator, {static: true})
paginator: MatPaginator;

@ViewChild(MatSort, {static: true})
sort: MatSort;

@ViewChild('filter', {static: true})
filter: ElementRef;
/*

*/
startDate : Date;
endDate: Date;
isDisabledDelete = true;
// Private
private _unsubscribeAll: Subject<any>;

  constructor(private _orderService:OrderService,
              private formBuilder: FormBuilder,
              public _matDialog: MatDialog,
              private _fuseTranslationLoaderService: FuseTranslationLoaderService,
              private _route: Router,
              private _activatedRoute : ActivatedRoute) { 
                 // Load the translations
        this._fuseTranslationLoaderService.loadTranslations(english, french , arabic);
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        const today = new Date();
        this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        this.endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        this.dateRangeForm=  this.createForm();
       /*  this.startDate = this._activatedRoute.snapshot.queryParamMap.get('start');
        this.endDate = this._activatedRoute.snapshot.queryParamMap.get('end'); */
              }

  ngOnInit() {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
   // this._orderService.getUIPlannedMissionParam();
   /*  if(isNullOrUndefined(this.startDate) && 
    isNullOrUndefined(this.endDate)) {
      const fromDate = new Date();
      fromDate.setMonth(this.today.getMonth() - 1);
      const toDate= new Date();
      toDate.setMonth(this.today.getMonth() );
      this.dateRangeForm = this.formBuilder.group({
        fromDate: new FormControl(fromDate, Validators.required),
        toDate: new FormControl(toDate, Validators.required)
      });
    }
   else {
    this.dateRangeForm = this.formBuilder.group({
      fromDate: new FormControl(new Date(this.startDate), Validators.required),
      toDate: new FormControl(new Date(this.endDate), Validators.required)
    });
   }
   let startDate:Date= this.dateRangeForm.get('fromDate').value;
   startDate.setHours(0);
   startDate.setMinutes(0);
   startDate.setSeconds(0);
   let EndDate:Date = this.dateRangeForm.get('toDate').value;
   EndDate.setHours(23);
   EndDate.setMinutes(59);
   EndDate.setSeconds(59);
    this._orderService.getMissions(startDate , EndDate)
    .then((values: any) => {
      this.dataSource = new MatTableDataSource(values);
    })
    .catch((reason : any) => {
      //console.log(reason);
      this.dataSource = new MatTableDataSource([]);
    });
     // Assign the data to the data source for the table to render
     this.dataSource = new MatTableDataSource([]); 
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

    this._orderService.onMissionsChanged.subscribe(data => {
           this.dataSource.data = data;
    }); */
  }
  createForm(): FormGroup {
    return new FormGroup({
  
       
      fromDate: new FormControl(new Date(this.startDate.getFullYear(),this.startDate.getMonth() ,this.startDate.getDate(),0,0 ,0)) ,
      toDate: new FormControl(new Date(this.endDate.getFullYear(),this.endDate.getMonth() ,this.endDate.getDate(),0,0 ,0)),
      
    });

    
}
  ngAfterViewInit() {
    /* this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort; */
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getMissions() {
    //console.log('Is Form Invalid', this.dateRangeForm.invalid);
    if(this.dateRangeForm.valid) {
      let startDate:Date= this.dateRangeForm.get('fromDate').value;
      
      let EndDate:Date = this.dateRangeForm.get('toDate').value;
    
      this._orderService.getMissions(startDate ,EndDate)
      .then((values: any) => {
        this.dataSource = values;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
      .catch((reason : any) => {
       console.log(reason);
      });
    }
  }
  
/**
     * Delete Contact
     */
deleteMission(mission): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._orderService.delete(mission);
            }
            this.confirmDialogRef = null;
        });
    }
edit(mission : Mission) : void {
  
  this._route.navigate(['/parc/app-order-management/missions'] ,
   { queryParams: { 'id': mission.Id, 'start': this.dateRangeForm.get('fromDate').value , 'end': this.dateRangeForm.get('toDate').value } })
}
add() : void {
  // [routerLink]="'new'"
  this._route.navigate(['/parc/app-order-management/missions'] ,
   { queryParams: { 'id': 'new', 'start': this.dateRangeForm.get('fromDate').value , 'end': this.dateRangeForm.get('toDate').value } })
}
verifyStatus(mission: Mission):void {
  let status = 2;
  let realTotalFuelConsumed = 0;
    this._orderService.calculateRealTotalFuelConsumed(this.dateRangeForm.get('fromDate').value, this.dateRangeForm.get('toDate').value, mission.TrackingTarget)
    .subscribe(data => {
      realTotalFuelConsumed = data
    },
    error => {
      console.log(error)
    })
    // isPlannedMissionAccomplished
     let  places: number[] = [];
     if(!isNullOrUndefined(mission.StartPlaceOfMission))
          places.push(mission.StartPlaceOfMission)
     if(!isNullOrUndefined(mission.DestinationPlaceOfMission))
          places.push(mission.DestinationPlaceOfMission)
     this._orderService.isPlannedMissionAccomplished(mission.TrackingTarget, this.dateRangeForm.get('fromDate').value, this.dateRangeForm.get('toDate').value, places)
         .subscribe((response : boolean) => {
            if(response)
             status = 1;
           else  status = 2
           return status;
         },
         error => {
           console.log(error)
         }),

     this.dialogRef = this._matDialog.open(VerifyStatusDialogComponent, {
      width:'250px',
      data      : {
          mission : mission,
          status:  status,
          realTotalFuelConsumed : realTotalFuelConsumed,
          height: '300px'
      }
     });

     this.dialogRef.afterClosed()
       .subscribe((response: FormGroup) => {
          if(!response){
            return;
          }
          this._orderService.update(mission, true, realTotalFuelConsumed);
       });
  }
  exportPDF():void {

    var fileName = 'PlannedMissionList(' + (new Date()).toLocaleString() + ').pdf'
    var prepare=[];
 /*    
    this._orderService.missions.forEach(e=>{
        var tempObj =[];
      tempObj.push(e.Number);
      tempObj.push(e.StatusMissionStr);
      tempObj.push(e.Car);
      tempObj.push(e.FullName);
      tempObj.push(e.Purpose);
      tempObj.push(e.EstimatedDateLocalOfStarting.toLocaleString());
      tempObj.push(e.StartPlace);
    //  tempObj.push(e.MaxDateLocalOfMission.toISOString().slice(0,10));
      tempObj.push(e.EstimatedDateLocalOfMission.toLocaleString());
      tempObj.push(e.DestinationPlace);
    //  tempObj.push(e.OdometerIn);
      tempObj.push(e.RealDateLocalOfStarting.toLocaleString());
      tempObj.push(e.RealDateLocalOfMission.toLocaleString());
      tempObj.push(e.RealMissionPeriodString);
      //tempObj.push(e.OdometerOut);
    //  tempObj.push(e.WeightLoaded);
      tempObj.push(e.PriceOfWeightLoaded);
     // tempObj.push(e.EstimatedTotalFuelConsumed);
     // tempObj.push(e.RealTotalFuelConsumed);
      tempObj.push(e.Cost);
      prepare.push(tempObj);
    });
    
    var doc = new jsPDF("landscape","in","a3");
    let finalY = doc.lastAutoTable.finalY || 20; // The y position on the page
   
    doc.text("Les visites/missions planifiées entre "+ this.dateRangeForm.get('fromDate').value+"et "+this.dateRangeForm.get('toDate').value, 20, finalY);
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.setFontStyle('bold');
    doc.autoTable({
        head: [[ 'N°', 'Etat','Véhicle','Responsable','Objet','Date de départ','Lieu de départ',
                 'Date de mission', 'Lieu d\'arrivée',  'Date réel de départ', 'Date réel de visite', 
                 'Période réelle',   'Valeur', 'Cout']],
        body: prepare,
        tableWidth: 'wrap',
       // Default for all columns
       styles: {overflow: 'linebreak', columnWidth: 'wrap', font: 'arial',overflowColumns: 'linebreak'},
          // Override the default above for the text column
      // columnStyles: { text: { cellWidth: 'auto' } }
    }); */
   // doc.save(fileName);
  }
  exportExcel() : void {
    var prepare_to_excel=[[ 'N°', 'Etat','Véhicle','Responsable','Objet','Date','Lieux','Max',
     'Date', 'Lieux', 'Km au départ' , 'Date départ', 'Date visite', 
     'Période réelle', 'Km à l\'arrivée', 'Chargé', 'Valeur', 'Estimé', 'Réel(l)', 'Cout']];
    /* this._orderService.missions.forEach(e=>{
      var tempObj =[];
    tempObj.push(e.Number);
    tempObj.push(e.StatusMissionStr);
    tempObj.push(e.Car);
    tempObj.push(e.FullName);
    tempObj.push(e.Purpose);
    tempObj.push(e.EstimatedDateLocalOfStarting.toISOString().slice(0,10));
    tempObj.push(e.StartPlace);
    tempObj.push(e.MaxDateLocalOfMission.toISOString().slice(0,10));
    tempObj.push(e.EstimatedDateLocalOfMission.toISOString().slice(0,10));
    tempObj.push(e.DestinationPlace);
    tempObj.push(e.OdometerIn);
    tempObj.push(e.RealDateLocalOfStarting.toISOString().slice(0,10));
    tempObj.push(e.RealDateLocalOfMission.toISOString().slice(0,10));
    tempObj.push(e.RealMissionPeriodString);
    tempObj.push(e.OdometerOut);
    tempObj.push(e.WeightLoaded);
    tempObj.push(e.PriceOfWeightLoaded);
    tempObj.push(e.EstimatedTotalFuelConsumed);
    tempObj.push(e.RealTotalFuelConsumed);
    tempObj.push(e.Cost);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'PlannedMissionList.xls', { bookType: 'xls', type: 'buffer' }); */
  }
  exportMissionPdf(mission: Mission): void {
    this._orderService.ExportReport("pdf",mission.Number,mission.DriverName,mission.EstimatedDateLocalOfMission,
    mission.RealDateLocalOfMission,mission.Matricule,0,0,mission.Purpose,mission.RealTotalFuelConsumed,mission.EstimatedTotalFuelConsumed,
    mission.WeightLoaded,0,mission.StartPlaceOfMissionDesc,mission.DestinationPlaceOfMissionDesc,mission.Cost).subscribe((data:any) => {
      let fileData64String= decrypt(data.CreateXtraReportPrintMissionNewResult) ;//.CreateXtraReportPrintMissionNewResult
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/pdf" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "MissionReport"
      titleReport += " " + "(" + dateString + ")";
 
 
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob); // For IE browser
     }
     const linkElement = document.createElement('a');
     const url = URL.createObjectURL(blob);
     linkElement.setAttribute('href', url);
     linkElement.setAttribute('download', titleReport+'.pdf');
     const clickEvent = new MouseEvent('click', {
       'view': window,
       'bubbles': true,
      'cancelable': false
     });
     linkElement.dispatchEvent(clickEvent);
    });

  }
  exportMissionExcel(mission: Mission): void {
    this._orderService.ExportReport("excel",mission.Number,mission.DriverName,mission.EstimatedDateLocalOfMission,
    mission.RealDateLocalOfMission,mission.Matricule,0,0,mission.Purpose,mission.RealTotalFuelConsumed,mission.EstimatedTotalFuelConsumed,
    mission.WeightLoaded,0,mission.StartPlaceOfMissionDesc,mission.DestinationPlaceOfMissionDesc,mission.Cost).subscribe((data:any) => {
      let fileData64String= decrypt(data.CreateXtraReportPrintMissionNewResult) ;
      var byteString = atob(fileData64String);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      var dateString = (new Date()).toLocaleDateString().replace('/', '-').replace('/', '-');
      var titleReport = "";
      titleReport = "MissionReport"
      titleReport += " " + "(" + dateString + ")";
 
 
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
       window.navigator.msSaveOrOpenBlob(blob); // For IE browser
     }
     const linkElement = document.createElement('a');
     const url = URL.createObjectURL(blob);
     linkElement.setAttribute('href', url);
     linkElement.setAttribute('download', titleReport+'.XLS');
     const clickEvent = new MouseEvent('click', {
       'view': window,
       'bubbles': true,
      'cancelable': false
     });
     linkElement.dispatchEvent(clickEvent);
     
    });
    

  }
}
export interface QueryParams {
  id : number;
  start: Date;
  end: Date;
}