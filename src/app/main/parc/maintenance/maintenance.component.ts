import {Component,ElementRef, OnInit , OnDestroy, SimpleChanges, Input , ViewChild, ViewEncapsulation ,ChangeDetectionStrategy, OnChanges} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatPaginator, MatSort, MatTableDataSource, MatTable, MatTabChangeEvent, MatDialogRef} from '@angular/material';
import { MaintenanceService } from "./maintenance.service";
import { IMaintenance, RepairMaintenanceLog, _MaintenanceTypeEnum } from "./department";
import { MatDialog, MatSnackBar } from '@angular/material';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/internal/operators';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { EventFormComponent } from './event-form/event-form.component';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import { RepairFormComponent } from './repairs/repair-form/repair-form.component';
import { isNullOrUndefined } from 'util';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as french } from '../i18n/fr';
import { locale as arabic } from '../i18n/ar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { json2array } from 'app/main/helpers/must-match.validator';
import { FuseUtils } from '@fuse/utils';
import { DataSource } from '@angular/cdk/collections';
import { RepairsService } from './repairs/repairs.service';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MaintenanceComponent  implements OnInit, OnDestroy{
 
 dialogRef: any;
 public dataSource =new MatTableDataSource<any>();
 //maintenanceList: any;
 searchkey:string;
public trackingObjects:any = [];
public ListCars:any=[];
selectedValue: number;
@Input()  selected: any;
// Get MaintenanceId
@Input() Id: number;
  public maintenances: IMaintenance[];
  displayedColumns = ['IsReminderByEnum','MaintenanceTypeString', 'MaintenanceFrequenceString',  'WarnMeBeforeNDayKmString','CurrentMileage' ,'NextMaintenance', 'actions'];
  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;
  vehicules = this.fb.group({
    cars: ['']
  });
  // @ViewChild('filter', {static: true})
  // filter: ElementRef;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  // Private
  private _unsubscribeAll: Subject<any>;
  whichButton: number = 0;
  types : any[];
  trackingObject : string = '';
  isDisabledDelete = true;
  newRepair: RepairMaintenanceLog = new RepairMaintenanceLog();
  filteredOptions: Observable<string[]>;
  /**
     * Constructor
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {MaintenanceService} _maintenanceService
     */
  constructor(
    private _maintenanceService: MaintenanceService,
    public dialog: MatDialog, 
    private snackBar: MatSnackBar,
    private router: Router,
    private _activatedRoute: ActivatedRoute,
    private translationLoader: FuseTranslationLoaderService,
    private _repairsService: RepairsService,
    private fb: FormBuilder)
    {
      // Set the private defaults
      this._unsubscribeAll = new Subject();
      // Load the translations
      this.translationLoader.loadTranslations(english, french, arabic);
      this.types = _MaintenanceTypeEnum ;
    }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
     * On init
     */ 

  displayVehicules = (car) => {
    let DriverFind =this.trackingObjects.find(x => x.id ==car ); 
    if(DriverFind)
    return DriverFind.name
    else
    return '';
    //? driver.Name : '';
  }
  onfilterCars(value) {
    console.log(value);
  }
  ngOnInit(): void {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    this._maintenanceService.maintenances =[];
    this._maintenanceService.onMaintenancesChanged.next([]);
    this._maintenanceService.onMaintenancesChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
      this.dataSource.data = data;
      this.maintenances=data;
    });
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
      this._activatedRoute.data.subscribe((data: {trackingObjects : any}) => {
      this.trackingObjects = json2array(data.trackingObjects.DicoTrackingObjects);
      this.ListCars=json2array(data.trackingObjects.DicoTrackingObjects);
      this.trackingObjects = this.trackingObjects.map(obj => {
                  return {id: obj.Key, name: obj.FullName}
                  });
    });
  /*  this._maintenanceService.onMaintenancesChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe( data => {
      this.maintenances = data;
    
   });*/
 this._maintenanceService.getTrackingObject().subscribe(data => {
     if(!isNullOrUndefined(data)) {
      this.selectedValue = data;
     // this.selected = data;
     }
   });
   this.filteredOptions = this.vehicules.get('cars').valueChanges
        .pipe(
          startWith(''),
          map(value => value ? this._filter(value): this.trackingObjects.slice())
        );
       
       
}
private _filter(value: string): string[]{
  if(value.length > 1) {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    
    let results =  this.trackingObjects.filter(option => option.name.toLowerCase().includes(filterValue));
    return results
  }else{
    return this.trackingObjects;
  }
}
displayFn = (car) => {
  if(car != null && car !='' && this.trackingObjects != null)
    return this.trackingObjects.find(x => x.id === car).name;
  return '';
  //? driver.Name : '';
}
  /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
     // this._maintenanceService.onMaintenancesChanged.next([]);
     //   this._maintenanceService.onMaintenancesChanged.complete() ;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
  onSelectedCar(car)
  { 
    console.log(car);
    
    this.selected = car.value;
    this._maintenanceService.getMaintenances(this.selected);
    this._maintenanceService.changeTrackingObject(car.value);
    this._maintenanceService.changeName(this.trackingObjects.find(it => it.id == this.selected).name);
  }
  filter() : void {
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  add() {
    if(this.whichButton === 0) {
//  // Add Maintenance 
let id =this.vehicules.value.cars;
 let car =this.ListCars.find(x => x.Key ==id ) ;
 this.dialogRef = this.dialog.open(EventFormComponent, {
   panelClass: 'event-form-dialog',
   data      : {
       action: 'new', 
       disabled : false, 
       car : car
   }
  });
  this.dialogRef.afterClosed()
  .subscribe((response: FormGroup) => {
      if ( !response )
      {
          return;
      }
      const newMaintenance = response.getRawValue();
      if(newMaintenance.IsReminderBy == 0){
            
            this._maintenanceService.AddOrUpdateMaintenanceByDate(newMaintenance, this.selectedValue);
             }
   else {
       this._maintenanceService.AddOrUpdateMaintenanceByOdometerOrEngineHours(newMaintenance, this.selectedValue);
   }
  });
   }
  else {
    this.dialogRef = this.dialog.open(RepairFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          action: 'new',
          show: true
               }
  });
    this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
        if ( !response )
        {
            return;
        }
        const newRepair = response.getRawValue();
        this._repairsService.addRepairMaintenanceLog(newRepair, this.selectedValue).subscribe(value => {
                  if(value){
                    this.newRepair = new RepairMaintenanceLog(value);
                  //  this.dataSource.data.unshift();
                  //  this.dataSource.data =  this.dataSource.data;
                  //  this.table.renderRows();
                   // Show the success message
                   this.snackBar.open('Repair added', 'OK', {
                      verticalPosition: 'top',
                      duration        : 2000
                        });
                  }
                  },
                  error => {
                   console.info(error);
                 })
        })
  }
  }


 // Edit Maintenance
  editMaintenance(action: string, maintenance: IMaintenance): void
  {
   
    //const maintenanceIndex = this.maintenances.indexOf(maintenance);
    this.dialogRef = this.dialog.open(EventFormComponent, {
      panelClass: 'event-form-dialog',
      data      : {
        maintenance : maintenance,
        action: action
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
            const newMaintenance = formData.getRawValue();
            if(newMaintenance.IsReminderBy == 0){
                  this._maintenanceService.AddOrUpdateMaintenanceByDate(formData.getRawValue(), this.selectedValue);
                   }
         else if(newMaintenance.IsReminderBy == 1 || newMaintenance.IsReminderBy == 2 ){
             this._maintenanceService.AddOrUpdateMaintenanceByOdometerOrEngineHours(newMaintenance, this.selectedValue)
           
            }
              break;
          /**
           * Delete
           */
          case 'delete':
            this.deleteMaintenance(maintenance)
              break;
      }
  });
  }

  adjustMaintenance(item: IMaintenance): void {
      const dialogRef = this.dialog.open(RepairFormComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'adjust',
          repair: new RepairMaintenanceLog({Id: item.Id, MaintenanceTypeStr: item.MaintenanceTypeString,
              Car: item.Car,EngineHoursCompletion: item.CurrentEngineHours , MileageCompletion: item.CurrentMileage})
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if ( !result )
                {
                    return;
                }
        const newLog = result.getRawValue();
        this._maintenanceService.confirmMaintenance(item.Id, newLog).subscribe(data=>{ 
          if(!isNullOrUndefined(data))
          {
            this.snackBar.open(data.MaintenanceTypeString + ' was successfully adjused ', 'OK' , {
              duration: 5000,
                // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right'
            });
          }
         
            
          });
      })
    }
/**
 * delete maintenance
 * **/
deleteMaintenance(item): void
  {
     this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              this._maintenanceService.DeleteMaintenance(item, this.selectedValue);
          }
          this.confirmDialogRef = null;
      });

  }
  downloadPdf() {
    var prepare=[];
    this.maintenances.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.MaintenanceTypeString);
      tempObj.push(e.MaintenanceFrequenceString);
      tempObj.push(e.WarnMeBeforeNDayKmString);
      tempObj.push(e.NextMaintenance);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.autoTable({
        head: [["Type d'entretien",'La fréquence','Me rappeler avant','Prochain entretien']],
        body: prepare
    });
    doc.save('maintenance management' + '.pdf');
  }
  exportExcel(){
    var prepare_to_excel=[["Type d'entretien",'La fréquence','Me rappeler avant','Prochain entretien']];
    this.maintenances.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.MaintenanceTypeString);
      tempObj.push(e.MaintenanceFrequenceString);
      tempObj.push(e.WarnMeBeforeNDayKmString);
      tempObj.push(e.NextMaintenance);

      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Gestion_maintenance.xls', { bookType: 'xls', type: 'buffer' });
 }
 tabChanged(tabChangeEvent: MatTabChangeEvent): void {

   this.whichButton = tabChangeEvent.index;
}
}
export class MaintenanceDataSource extends DataSource<any>
{
    // Private
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {EcommerceOrdersService} _ecommerceOrdersService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _maintenancesService: MaintenanceService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._maintenancesService.maintenances;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any
    {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any)
    {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string
    {
        return this._filterChange.value;
    }

    set filter(filter: string)
    {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._maintenancesService.onMaintenancesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._maintenancesService.maintenances.slice();

                data = this.filterData(data);

                this.filteredData = [...data];

                data = this.sortData(data);

                // Grab the page's slice of data.
                const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                return data.splice(startIndex, this._matPaginator.pageSize);
            })
        );

    }

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any
    {
        if ( !this.filter )
        {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[]
    {
        if ( !this._matSort.active || this._matSort.direction === '' )
        {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch ( this._matSort.active )
            {
              case 'MaintenanceTypeString':
                    [propertyA, propertyB] = [a.MaintenanceTypeString, b.MaintenanceTypeString];
                    break;
                case 'MaintenanceFrequenceString':
                    [propertyA, propertyB] = [a.MaintenanceFrequenceString, b.MaintenanceFrequenceString];
                    break;
                case 'WarnMeBeforeNDayKmString':
                    [propertyA, propertyB] = [a.WarnMeBeforeNDayKmString, b.WarnMeBeforeNDayKmString];
                    break;
                case 'NextMaintenance':
                    [propertyA, propertyB] = [a.NextMaintenance, b.NextMaintenance];
                    break;
               case 'IsReminderByEnum':
                      [propertyA, propertyB] = [a.IsReminderByEnum, b.IsReminderByEnum];
                      break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }

    
}



