import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import * as XLSX from 'xlsx';  
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as french } from '../i18n/fr';
import { locale as arab } from '../i18n/ar';
import { TranslateService } from '@ngx-translate/core';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { GestionDesVehiculesService } from './gestion-des-vehicules.service';
import { VehicleFormDialogComponent } from './vehicle-form-dialog/vehicle-form-dialog.component';
import { FormGroup } from '@angular/forms';
import { Vehicle } from './model';
import { OperationFormDialogComponent } from './car-log/operation-form-dialog/operation-form-dialog.component';
import { BehaviorSubject, forkJoin, merge, Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { FuseUtils } from '@fuse/utils';
import { map } from 'rxjs/operators';
import { isUndefined } from 'lodash';
import * as _ from 'lodash';
@Component({
  selector: 'app-gestio-des-vehicules',
  templateUrl: './gestio-des-vehicules.component.html',
  styleUrls: ['./gestio-des-vehicules.component.scss'],
  animations: fuseAnimations
})
export class GestioDesVehiculesComponent implements OnInit{
   // Private
   private _unsubscribeAll: Subject<any>;
   dialogRef: any;
  constructor(private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _gestionDesVehiculesService: GestionDesVehiculesService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    public _matDialog: MatDialog) {
  this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
    // Set the private defaults
    this._unsubscribeAll = new Subject();
}
  displayedColumns: string[] = ['icon','Matricule','Departemant','SpecialityName','Etat','Chauffeur','Marque','Modele','Année','Type','Equipement','Capacite','kilometrage','Conso','MobileTelephoneNumber','ChassisNumber','actions'];
  dataSource: FilesDataSource  | null;  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  @ViewChild('ExampleTable', {static: false}) ExampleTable: ElementRef;
  searchkey: string;
  indeterminate = true;
  isCommandListVisible = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
 vehicles : Vehicle[];
 panelOpenState = false;
 isDisabledDelete = true;

  ngOnInit() {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    
    this._gestionDesVehiculesService.onVehiclesChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      
      this.vehicles = data;
    });
    
    this.dataSource = new FilesDataSource(this._gestionDesVehiculesService, this.paginator, this.sort)

    
    this._gestionDesVehiculesService.onCommandListChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      if(data[0] != null)
        this.isCommandListVisible = true;
    });
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
  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  hideCommdListTable(){
    this.isCommandListVisible = false;
  }
  delete(vehicle){
    
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
    });

this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

this.confirmDialogRef.afterClosed().subscribe(result => {
    if (result)
    {
      this._gestionDesVehiculesService.deleteVehicle(vehicle);
    }
    this.confirmDialogRef = null;
  });
}
edit(item): void{
   if(item.IsTransportation){
     this.editVehicle(item);
   }
  else {
      this.editPerson(item);
    }
}
 /**
     * Edit vehicle
     *
     * @param vehicle
     */
    editVehicle(vehicle): void{
      this.dialogRef = this._matDialog.open(VehicleFormDialogComponent, {
        panelClass: ['event-form-dialog', 'custom-dialog-container'],
        data      : {
          vehicleOrPerson: vehicle,
          action: 'edit',
          departments: this._gestionDesVehiculesService.departments,
          Specialities: this._gestionDesVehiculesService.Specialities,
          types: this._gestionDesVehiculesService.carTypes,
          models: this._gestionDesVehiculesService.carModels,
          accounts: this._gestionDesVehiculesService.acounts,
          drivers: this._gestionDesVehiculesService.drivers,
          carIcons: this._gestionDesVehiculesService.carIcons,
          CanChangeSimNumber: this._gestionDesVehiculesService.CanChangeSimNumber

        }
      });
      this.dialogRef.afterClosed()
      .subscribe( async response => {
        
          if ( !response )
          {
              return;
          }
          let carImage = response[2];
          const formData: FormGroup = response[1];
            let grayCardImage = response[3]
            const actionType: string = response[0];
        

          
       
          switch ( actionType )
          {
              /**
               * Save
               */
              case 'save':
                let ScannedGrayCardUrl:any=null;
                let ScannedImgCar:any=null;
                if(carImage.length != 0){
                 
                  ScannedImgCar=await  this._gestionDesVehiculesService.uploadImgCar(carImage[0],vehicle.Key).toPromise();
                  
              }
              else
              {
               
                ScannedImgCar=vehicle.ScannedCarUrl;
              }
              if(grayCardImage.length != 0){
                 
                ScannedGrayCardUrl=await  this._gestionDesVehiculesService.uploadGrayCard(grayCardImage[0],vehicle.Key).toPromise();
            }
            else
                ScannedGrayCardUrl=vehicle.ScannedGrayCardUrl;

              this._gestionDesVehiculesService.addOrUpdateVehicle(formData.getRawValue(),ScannedGrayCardUrl,ScannedImgCar).subscribe((data:any) => {
                
              });
  
                  break;
              /**
               * Delete
               */
              case 'delete':
  
                  this.delete(Vehicle);
  
                  break;
          }
        
      });
    }
  /**
   * Edit person
   * @param person
   */
  editPerson(person) : void{
    
    this.dialogRef = this._matDialog.open(VehicleFormDialogComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          vehicleOrPerson: person,
          action: 'edit',
          departments: this._gestionDesVehiculesService.departments,
          personIcons: this._gestionDesVehiculesService.personIcons,
          IsTransportation: person.IsTransportation
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

                this._gestionDesVehiculesService.addOrUpdatePerson(formData.getRawValue());

                break;
            /**
             * Delete
             */
            case 'delete':

                this.delete(Vehicle);

                break;
        }
    });
  }
    /**
     * New vehicle
     */
addVehicle(): void
{
    this.dialogRef = this._matDialog.open(VehicleFormDialogComponent, {
        panelClass: ['contact-form-dialog', 'custom-dialog-container'],
        data      : {
            action: 'new',
            departments: this._gestionDesVehiculesService.departments,
            Specialities: this._gestionDesVehiculesService.Specialities,
            types: this._gestionDesVehiculesService.carTypes,
            models: this._gestionDesVehiculesService.carModels,
            accounts: this._gestionDesVehiculesService.acounts,
            drivers: this._gestionDesVehiculesService.drivers,
            carIcons: this._gestionDesVehiculesService.carIcons,
            personIcons : this._gestionDesVehiculesService.personIcons,
            CanChangeSimNumber: this._gestionDesVehiculesService.CanChangeSimNumber

        }
    });
    
    this.dialogRef.afterClosed()
        .subscribe(async (response: FormGroup) => {
            if ( !response )
            {
                return;
            }
            let carImage = response[1]
            let grayCardImage = response[2];
            let ScannedGrayCardUrl:any=null;
            let ScannedImgCar:any=null;
         
            if(carImage.length != 0){
              ScannedImgCar= await  this._gestionDesVehiculesService.uploadImgCar(carImage[0],"").toPromise();
            }   
            if(grayCardImage.length != 0){
              ScannedGrayCardUrl= await  this._gestionDesVehiculesService.uploadImgCar(grayCardImage[0],"").toPromise();
            }   
              if(response[0].getRawValue().isTransportation){
                this._gestionDesVehiculesService.addOrUpdateVehicle(response[0].getRawValue(),ScannedGrayCardUrl,ScannedImgCar).subscribe((data:any) => {});
              }
              else
              this._gestionDesVehiculesService.addOrUpdatePerson(response[0].getRawValue());
        });
}
/**
 * 
 * add New Operation
 * */
addOperation(vehicleId : number): void {
  this.dialogRef = this._matDialog.open(OperationFormDialogComponent, {
    panelClass: 'form-dialog-operation',
    data      : {
        action: 'new',
        departments: this._gestionDesVehiculesService.departments,
        drivers: this._gestionDesVehiculesService.drivers,
        accounts: this._gestionDesVehiculesService.acounts,
    }
});

this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
        if ( !response )
        {
            return;
        }
        this._gestionDesVehiculesService.addOperation(response.getRawValue(), vehicleId);
    });
}
  downloadPdf() {
    var prepare=[];
    this._gestionDesVehiculesService.vehicles.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.FullName);
      tempObj.push(e.DepartmentName);
      tempObj.push(e.DriverName);
      tempObj.push(e.CurrentCarType);
      tempObj.push(e.CurrentCarModelString);
      tempObj.push(e.CurrentModelYear);
      tempObj.push(e.CurrentFuelTypeEnum);
      tempObj.push(e.FuelContainerCapacity);
      tempObj.push(e.MileageFloat);
      tempObj.push(e.CurrentEquipmentElement != null ? e.CurrentEquipmentElement.SimCardNumber : '');

      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des vehicules', 78, 16); //default
    doc.autoTable({
        head: [['Matricule','Departemant','Chauffeur','Marque','Modele','Année','Type','Capacite','kilometrage','Numéro de puce']],
        body: prepare,
        startY: 20
    });
    doc.save('Vehicules_List' + '.pdf');
  }
 
  exportExcel(){
    var prepare_to_excel=[];
    let tem =[];
    tem.push('Nom Complet');
    tem.push('Nom de Département');
    tem.push('Nom de Chauffeur');
    tem.push('Marque');
    tem.push('Modéle');
    tem.push('Année');
    tem.push('Type d energie');
    tem.push('Kilométrage');
    tem.push('Capacité');
    tem.push('Numéro de puce');
    tem.push('équipement');
    prepare_to_excel.push(tem);
    this._gestionDesVehiculesService.vehicles.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.FullName);
      tempObj.push(e.DepartmentName);
      tempObj.push(e.DriverName);
      tempObj.push(e.CurrentCarType);
      tempObj.push(e.CurrentCarModelString);
      tempObj.push(e.CurrentModelYear);
      tempObj.push(e.CurrentFuelTypeEnum);
      tempObj.push(e.FuelContainerCapacity);
      tempObj.push(e.MileageFloat);
      tempObj.push(e.CurrentEquipmentElement != null ? e.CurrentEquipmentElement.SimCardNumber : '');
      tempObj.push(e.CurrentEquipmentSerialNumber);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'Liste_Véhicules.xls', { bookType: 'xls', type: 'buffer' });
 }
  onCheckboxChangeFn(evt){
      
  this._gestionDesVehiculesService.selectEquippedVehicles(evt.checked);
    }
    refresh() {
      this.changeDetectorRefs.detectChanges();
    }
    }
   
export class FilesDataSource extends DataSource<any>
{
    // Private
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {GestionDesVehiculesService} _vehicleService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _vehicleService: GestionDesVehiculesService ,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();
        this.filteredData = this._vehicleService.vehicles;
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
            this._vehicleService.onVehiclesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._vehicleService.vehicles.slice();

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
                case 'Matricule':
                    [propertyA, propertyB] = [a.FullName, b.FullName];
                    break;
                case 'Matricule2':
                    [propertyA, propertyB] = [a.FullName2, b.FullName2];
                    break;
                case 'Departemant':
                    [propertyA, propertyB] = [a.DepartmentName, b.DepartmentName];
                    break;
                case 'Etat':
                    [propertyA, propertyB] = [a.Connected, b.Connected];
                    break;
                case 'Chauffeur':
                    [propertyA, propertyB] = [a.DriverName, b.DriverName];
                    break;
                case 'Marque':
                    [propertyA, propertyB] = [a.CurrentCarType, b.CurrentCarType];
                      break;
                case 'Modele':
                    [propertyA, propertyB] = [a.CurrentCarModelString, b.CurrentCarModelString];
                    break;
                case 'Année':
                    [propertyA, propertyB] = [a.CurrentModelYear, b.CurrentModelYear];
                    break;
                case 'Type':
                      [propertyA, propertyB] = [a.CurrentFuelTypeEnum, b.CurrentFuelTypeEnum];
                      break;
                case 'Equipement':
                      [propertyA, propertyB] = [a.CurrentEquipmentSerialNumber, b.CurrentEquipmentSerialNumber];
                        break;
                case 'Capacite':
                     [propertyA, propertyB] = [a.FuelContainerCapacity, b.FuelContainerCapacity];
                          break;
                case 'kilometrage':
                      [propertyA, propertyB] = [a.MileageFloat, b.MileageFloat];
                            break;
                case 'Conso':
                      [propertyA, propertyB] = [a.FuelTheoreticalCosumptionAvg, b.FuelTheoreticalCosumptionAvg];
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
