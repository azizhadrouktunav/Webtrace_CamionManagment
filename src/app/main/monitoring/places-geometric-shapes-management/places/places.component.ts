import { SelectionModel } from '@angular/cdk/collections';
import {DataSource} from '@angular/cdk/table';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { LatLng, Marker } from 'leaflet';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { GlobalMap } from '../../map/map';
import { Place, Point, Value } from '../model';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { isEmpty, isUndefined } from 'lodash';
import { PlacesService } from './places.service';
import { PlaceFormComponent } from './place-form/place-form.component';

import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/fr';
import { locale as arab } from '../../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as XLSX from 'xlsx';  
import { TrackingObjectService } from '../../tracking/tracking-objects.service';
import { environment } from 'environments/environment';
import { MockStoreService } from 'app/mock/mock-store.service';
import { DrawnPlace } from 'app/mock/data/geo-shapes';
import { zoneKindLabel } from '../../geo-zone-assign';
@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PlacesComponent implements OnInit ,OnDestroy {
  
  Map : GlobalMap = GlobalMap.globalMap;
  isMock = environment.mock;
  displayedColumns = environment.mock
    ? ['location', 'action']
    : ['select', 'icon', 'location', 'visibility', 'description', 'action'];
  dataSource: MatTableDataSource<any>;
  places: Place[] = [];
  lenghtRow :number=0;

@ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

@ViewChild(MatSort, {static: true})
    sort: MatSort;
@ViewChild('filter', {static: true})
    filter: ElementRef;
  // Private
  private _unsubscribeAll: Subject<any>;
  selection = new SelectionModel<Place>(true, []);
  
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;

  constructor(
    private _trackingObjectService: TrackingObjectService,
    public _matDialog: MatDialog,
    private _placesService: PlacesService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _mockStore: MockStoreService
    ) {
            // Set the private defaults
            this._unsubscribeAll = new Subject();
            this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
  }

  ngOnInit() {
   
   this.dataSource = new MatTableDataSource([]);
    if (this.isMock) {
      this._mockStore.drawnPlaces
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((items: DrawnPlace[]) => {
          this.dataSource.data = items.map(p => ({
            id: p.id,
            NamePlace: p.name,
            zoneKind: p.zoneKind,
            zoneLabel: zoneKindLabel(p.zoneKind),
            lat: p.lat,
            lng: p.lng
          }));
          this.lenghtRow = this.dataSource.data.length;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
    } else {
      this._trackingObjectService.onPlacesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(places => {
                this.places = places;
                this.lenghtRow=this.places.length;
              
               this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                //this.dataSource.data = this.getTableData(0,25);
                this.dataSource.data=this.places;
            });
    }
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
    this.selection.changed.subscribe(data => {
        var isSelected: boolean = !this.isAllSelected();
        if(isSelected) {
            data.added.forEach(place => {
                this.Map.togglePlace(place.Id, true);
            });
            data.removed.forEach(place => {
                this.Map.togglePlace(place.Id, false);
            })
        }
    });
  }
  getTableData(start,end)
  {
     return this.places.filter((value, index) => index >= start && index < end)
  }
  onPaginate(pageEvent: PageEvent)
  { 
      let test =pageEvent;
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */
  ngAfterViewInit() {
  
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
    // onSelectedChange(place) {
    //         console.log(place);
    // }
    applyFilter(filterValue: string, value: string) : void {

        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
         switch(value) {
             case 'description' : {
                this.dataSource.filterPredicate = function(data, filter: string): boolean {
                    return data.Description.toLowerCase().includes(filter);
                  };
                  break;
             }
             case 'name' : {
                this.dataSource.filterPredicate = function(data, filter: string): boolean {
                    return data.NamePlace.toLowerCase().includes(filter);
                  };
                  break;
             }
             case 'visibility' : {
                this.dataSource.filterPredicate = function(data, filter: string): boolean {
                    return data.PlaceAccessTypeString.toLowerCase().includes(filter);
                  };
                  break;
             }
             default: { 
                //statements; 
                break; 
             } 
         }
          this.dataSource.filter = filterValue;
    }
/** Whether the number of selected elements matches the total number of rows. */
isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

/** Selects all rows if they are not all selected; otherwise clear selection. */
masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));

    this.Map.toggleAllPlace(this.isAllSelected());
  }

 /** The label for the checkbox on the passed row */
 checkboxLabel(row?: Place): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Id}`;
}
   /**
     * Edit place
     *
     * @param place
     */
    editPlace(place: Place): void
    {  
      var index = this._trackingObjectService.places.indexOf(place);
      var names = this._trackingObjectService.places;
        // names.splice(index, 1)
     //   names.map(item => item.NamePlace);
        this.dialogRef = this._matDialog.open(PlaceFormComponent, {
            panelClass: 'app-place-form',
            disableClose: true,
            data      : {
                place: place,
                action : 'edit',
                names:names
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
                     
                     

                        this._placesService.editPlace(formData.getRawValue());
                        

                        break;
                    
                    case 'delete':

                        this.deletePlace(place.Id);

                        break;
                }
              
            });
    }
  /*show place*/
  showPlace(place: Place):void {
    this.Map.togglePlace(place.Id);
  }

  /* delete place*/
  deletePlace(id: number | string): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                if (this.isMock && typeof id === 'string') {
                    this._mockStore.removeDrawnPlace(id);
                } else {
                    this._placesService.deletePlace(id as number).then((isRemoved) => {
                        if(isRemoved) {
                                this.Map.togglePlace(id as number, false);
                        }
                    });
                }
            }
            this.confirmDialogRef = null;
        });

    }
/**
 * export pdf
 **/
exportpdf() {

    var title = 'Management locations';
    var prepare=[];
  this.dataSource.filteredData.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.NamePlace);
    tempObj.push(e.PlaceAccessTypeString);
    tempObj.push(e.Description);
    prepare.push(tempObj);
  });
  const doc = new jsPDF('p', 'pt');
   doc.setFontSize(12);
  doc.setTextColor(0);
  doc.setFontStyle('bold');
  doc.text(title, 78, 20); //default
  
  doc.autoTable({
      head: [['Location', 'Visivility', 'Description']],
      body: prepare
  });
  doc.save(title+ '.pdf');
  }
  exportExcel() :void {
    var prepare_to_excel=[];
    let tem = ['Location', 'Visivility', 'Description'];
    prepare_to_excel.push(tem);
    this.dataSource.data.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.NamePlace);
      tempObj.push(e.PlaceAccessTypeString);
      tempObj.push(e.Description);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'ManagementLocations.xls', { bookType: 'xls', type: 'buffer' });
  }
}

export class FilesDataSource extends DataSource<any>
{
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');

    /**
     * Constructor
     *
     * @param {TrackingObjectService} _trackingObjectService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _trackingObjectService: TrackingObjectService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._trackingObjectService.places;
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        const displayDataChanges = [
            this._trackingObjectService.onPlacesChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges)
            .pipe(
                map(() => {
                        let data = this._trackingObjectService.places.slice();

                        data = this.filterData(data);

                        this.filteredData = [...data];

                        data = this.sortData(data);

                        // Grab the page's slice of data.
                        const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
                        return data.splice(startIndex, this._matPaginator.pageSize);
                    }
                ));
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
        //return data.filter(obj => this.filterPredicate(obj, this.filter));
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
   * Checks if a data object matches the data source's filter string. By default, each data object
   * is converted to a string of its properties and returns true if the filter has
   * at least one occurrence in that string. By default, the filter string has its whitespace
   * trimmed and the match is case-insensitive. May be overridden for a custom implementation of
   * filter matching.
   * @param data Data object used to check against the filter.
   * @param filter Filter string that has been set on the data source.
   * @returns Whether the filter matches against the data
   */
    filterPredicate: ((data: Place, filter: string) => boolean) = (data: Place, filter: string): boolean => {
    // Transform the data into a lowercase string of all property values.
    const accumulator = (currentTerm, key) => currentTerm + data[key];
    const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();

    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filter.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) != -1;
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
                case 'location':
                    [propertyA, propertyB] = [a.NamePlace, b.NamePlace];
                    break;
                case 'icon':
                    [propertyA, propertyB] = [a.m_icon.MediumName, b.m_icon.MediumName];
                    break;
                case 'visibility':
                    [propertyA, propertyB] = [a.PlaceAccessTypeString, b.PlaceAccessTypeString];
                    break;
                case 'description':
                    [propertyA, propertyB] = [a.Description, b.Description];
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
