import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { PlacesGeometricShapesManagementService } from '../places-geometric-shapes-management.service';
import { GlobalMap } from '../../map/map'
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { fuseAnimations } from '@fuse/animations';
import { WayDialogComponent } from './way-form/add-way-dialog.component';
import { LatLng, Polyline } from 'leaflet';
import { DataSource } from '@angular/cdk/table';
import { debounceTime, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { Shape } from '../model';
import * as XLSX from 'xlsx';
import { environment } from 'environments/environment';
import { MockStoreService } from 'app/mock/mock-store.service';
import { DrawnWay } from 'app/mock/data/geo-shapes';
@Component({
  selector: 'ways',
  templateUrl: './ways.component.html',
  styleUrls: ['./ways.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class WaysComponent implements OnInit , OnDestroy {
  
  _latlngs: LatLng[];
  line: any;
  dialogRef: any;
  Map : GlobalMap = GlobalMap.globalMap;
  controls : FormArray;
  ways : any;
  isMock = environment.mock;
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: FilesDataSource | MatTableDataSource<any> | null;
  mockDataSource = new MatTableDataSource<any>([]);
  isHover: boolean = false;
  hoveredRow : any;
  @ViewChild(MatPaginator, {static: true})
    paginator: MatPaginator;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

    @ViewChild(MatSort, {static: true})
    sort: MatSort;
  eventsSubject: Subject<Event> = new Subject<Event>();
  // Private
  private _unsubscribeAll: Subject<any>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  emitEventToChild(e) {
      this.eventsSubject.next(e);
    } 
  constructor(
              private _shapesManagementService:PlacesGeometricShapesManagementService,
              private _matDialog : MatDialog,
              private _mockStore: MockStoreService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
   }

  ngOnInit() {

    if (this.isMock) {
      this.dataSource = this.mockDataSource;
      this._mockStore.drawnWays
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((items: DrawnWay[]) => {
          this.mockDataSource.data = items.map(w => ({
            id: w.id,
            name: w.name,
            zoneLabel: '—',
            coords: w.coords,
            Value: { Name: w.name }
          }));
          this.mockDataSource.paginator = this.paginator;
          this.mockDataSource.sort = this.sort;
        });
    } else {
      this._shapesManagementService.getWays()
      .then((value : any ) =>{
        this.dataSource = new FilesDataSource(this._shapesManagementService, this.paginator, this.sort);
       
      }).catch((reason : any)=> {
        console.log(reason);
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
  }
  ngOnDestroy(){
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete()
  }

    /**
     * Delete Way
     */
    deleteWay(way: any): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                if (this.isMock && way.id) {
                    this._mockStore.removeDrawnWay(way.id);
                } else {
                    this._shapesManagementService.deleteWay(way).then((isRemoved) => {
                       if(isRemoved) {
                         this.Map.drawer.hideShape(+way.Key)
                       }
                    });
                }
            }
            this.confirmDialogRef = null;
        });

    }
   showWay(element: Shape){
    var latlngs: LatLng [] = [];
     element.Value.Points.map(item => {
       latlngs.push(new LatLng(item.Latitude, item.Longitude));
     })
    this.Map.drawer.showPolyline(latlngs, element.Value.Name, +element.Key);
  }
  /**
     * Edit place
     *
     * @param place
     */
    editWay(way: Shape): void
  {  
           
      var names = this._shapesManagementService.ways;
      var index = this._shapesManagementService.ways.indexOf(way);
     
     // names.splice(index, 1);
      names.map(item => item.Value.Name);
        
        this._matDialog.closeAll();
        this.dialogRef = this._matDialog.open(WayDialogComponent, {
          disableClose: true,
          hasBackdrop : false,
            data      : {
                way: way,
                action : 'edit',
                title: 'Common.UpdateRoute',
                names: names,
                msgError : 'Route with this name already exists. Try again with a new name.'
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

                        this._shapesManagementService.updateWay(formData.value, way.Key, index);
                        this.dialogRef = null;
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteWay(way);
                        this.dialogRef = null;
                        break;
                }
            });
    }

   /**
 * export pdf
 **/
exportpdf() {
  var title = 'Management routes';
  var prepare=[];
this._shapesManagementService.ways.forEach(e=>{
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
  let tem = ['Routes'];
  prepare_to_excel.push(tem);
  this._shapesManagementService.ways.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.Value.Name);
    prepare_to_excel.push(tempObj);
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, 'RoutesList.xls', { bookType: 'xls', type: 'buffer' });
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
     * @param {EcommerceOrdersService} _ecommerceOrdersService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
      private _shapesManagementService:PlacesGeometricShapesManagementService,
      private _matPaginator: MatPaginator,
      private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._shapesManagementService.ways;
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
            this._shapesManagementService.onWaysChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._shapesManagementService.ways.slice();

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
                case 'name':
                    [propertyA, propertyB] = [a.Value.Name, b.Value.Name];
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