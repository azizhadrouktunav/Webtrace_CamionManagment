import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { LatLng } from 'leaflet';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { GlobalMap } from '../../map/map';
import { Shape } from '../model';
import { PlacesGeometricShapesManagementService } from '../places-geometric-shapes-management.service';
import { WayDialogComponent } from '../ways/way-form/add-way-dialog.component';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import * as L from 'leaflet';
import { environment } from 'environments/environment';
import { MockStoreService } from 'app/mock/mock-store.service';
import { DrawnPolygon } from 'app/mock/data/geo-shapes';
import { zoneKindLabel } from '../../geo-zone-assign';
@Component({
  selector: 'app-polygons',
  templateUrl: './polygons.component.html',
  styleUrls: ['./polygons.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class PolygonsComponent implements OnInit, OnDestroy
{
  
    dataSource: FilesDataSource | MatTableDataSource<any> | null;
    displayedColumns = ['name', 'actions'];
    isMock = environment.mock;
    mockDataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

    @ViewChild('filter', {static: true})
    filter: ElementRef;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;
    
    Map : GlobalMap = GlobalMap.globalMap;
    polygon: L.Polygon;
    _latlngs: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    addDialogRef: MatDialogRef<WayDialogComponent>;

    nameFilter = new FormControl();
    filteredValues = new Shape({});

    globalFilter = '';
    // Private
    private _unsubscribeAll: Subject<any>;
  constructor(
    private _placesGeometricShapesManagementService: PlacesGeometricShapesManagementService,
    private _matDialog : MatDialog,
    private _mockStore: MockStoreService
  )
   {
     // Set the private defaults
     this._unsubscribeAll = new Subject();
   }
 // -----------------------------------------------------------------------------------------------------
// @ Lifecycle hooks
// -----------------------------------------------------------------------------------------------------
  /**
     * On init
     */
    ngOnInit(): void
    {
      if (this.isMock) {
        this.dataSource = this.mockDataSource;
        this._mockStore.drawnPolygons
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe((items: DrawnPolygon[]) => {
            this.mockDataSource.data = items.map(p => ({
              id: p.id,
              name: p.name,
              zoneKind: p.zoneKind,
              zoneLabel: zoneKindLabel(p.zoneKind),
              coords: p.coords,
              Value: { Name: p.name }
            }));
            this.mockDataSource.paginator = this.paginator;
            this.mockDataSource.sort = this.sort;
          });
      } else {
        this._placesGeometricShapesManagementService.getPolygons().then(() => {
             this.dataSource = new FilesDataSource(this._placesGeometricShapesManagementService, this.paginator, this.sort);
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

           this.nameFilter.valueChanges.subscribe((nameFilterValue) => {

            this.dataSource.filter = nameFilterValue;
               
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
    showPolygon(polygon: Shape) : void {
       let points = polygon.Value.Points.map(point => {return new LatLng(point.Latitude ,point.Longitude)});
       this.Map.drawer.showPolygon(points, polygon.Value.Name, +polygon.Key);
    }
    // update name
    editPolygon(polygon: Shape) : void {

        // this.Map.drawer.editPolygon()

      var names = this._placesGeometricShapesManagementService.polygons;
      var index = this._placesGeometricShapesManagementService.polygons.indexOf(polygon);
     

      let coords = names[index].Value.Points.map(p => new L.LatLng(p.Latitude, p.Longitude))

      let latlngs = []
      this.Map.drawer.editPolygon(coords, (poly)=>{
        latlngs = poly.getLatLngs()[0].map(item => ({
                Latitude: item.lat,
                Longitude: item.lng
            }))
      })

    //  // names.splice(index, 1);
    //   names.map(item => item.Value.Name);
      this._matDialog.closeAll();
      this.addDialogRef = this._matDialog.open(WayDialogComponent, {
        disableClose: true,
        hasBackdrop : false,
          data      : {
              way: polygon,
              action : 'edit',
              title: 'Mettre à jour le polygone',
              names: names,
              msgError: 'La forme portant ce nom existe déjà. Réessayez avec un nouveau nom.'
            
          }
      });

      this.addDialogRef.afterClosed()
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

                      this._placesGeometricShapesManagementService.updatePolygon(+polygon.Key, formData.value, index, latlngs);
                      this.addDialogRef = null;
                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deletePolygon(polygon);
                      this.addDialogRef = null;
                      break;
              }
          });
    }
    deletePolygon(polygon: any) :void {
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            if (this.isMock && polygon.id) {
                this._mockStore.removeDrawnPolygon(polygon.id);
            } else {
                this._placesGeometricShapesManagementService.deletePolygon(polygon.Value.Key).then(() => {
                    this.Map.drawer.hideShape(+polygon.Key);
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
  var title = 'Management polygons';
  var prepare=[];
this._placesGeometricShapesManagementService.polygons.forEach(e=>{
  var tempObj =[];
  tempObj.push(e.Value.Name);
  prepare.push(tempObj);
});
const doc = new jsPDF('p', 'pt');
 doc.setFontSize(12);
doc.setTextColor(0);
doc.setFontStyle('bold');
doc.text(title, 78, 20); //default

doc.autoTable({
    head: [['Name']],
    body: prepare
});
doc.save(title+ '.pdf');
}

exportExcel(): void {
    var prepare_to_excel=[];
    let tem = ['Polygons'];
    prepare_to_excel.push(tem);
    this._placesGeometricShapesManagementService.polygons.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.Value.Name);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, 'PolygonsList.xls', { bookType: 'xls', type: 'buffer' });
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
     * @param {PlacesGeometricShapesManagementService} _placesGeometricShapesManagementService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _placesGeometricShapesManagementService: PlacesGeometricShapesManagementService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._placesGeometricShapesManagementService.polygons;
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
            this._placesGeometricShapesManagementService.onPolygonsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._placesGeometricShapesManagementService.polygons.slice();

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
             
            if(this._matSort.active == 'name') {
              [propertyA, propertyB] = [a.Value.Name, b.Value.Name];
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
