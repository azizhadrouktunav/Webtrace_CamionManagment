import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef, MatTableDataSource } from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as jsPDF from 'jspdf';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { DocumentLogModel, getdocumentTypeString, getIcon } from '../documentModel';
import { DocumentLogService } from './document-log.service';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/table';
import { FuseUtils } from '@fuse/utils';

@Component({
  selector: 'app-documenthistory',
  templateUrl: './documenthistory.component.html',
  styleUrls: ['./documenthistory.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),fuseAnimations
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
  
})
export class DocumenthistoryComponent implements OnInit, OnDestroy {
  trackingObject: number;
  documentType: number;
  documentTypeString: number;
  tableFooterColumns: string[] = [ 'Cost', 'PaidCost'];
  displayedColumns = ['DateAvailableFromGMT', 'DateAvailableToGMT', 'Cost', 'PaidCost', 'PaidDateGMT', 'Description', 'InvoiceReference', 'Supplier','actions'];
  @ViewChild(MatSort, { static: true }) 
  sort: MatSort;
  @ViewChild(MatPaginator,{ static: true }) 
  paginator: MatPaginator;
  @ViewChild('filter', {static: true})
  filter: ElementRef;
  dataSource: FilesDataSource | null;
  dialogTitle: String;
  icondocument: String;
  logs: DocumentLogModel[] = [];
  trackingObjects: any = [];
  private _unsubscribeAll: Subject<any>;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  CarMatricule: string = '';
  constructor(
              private _matDialog: MatDialog,
              private _documentLogService : DocumentLogService,
              private route: ActivatedRoute)
             {  
        this._unsubscribeAll = new Subject();
      
      if (this.route.snapshot.params['documentType']) {
        this.documentTypeString = +this.route.snapshot.params['documentType'];
        
      }
      this.dialogTitle = getdocumentTypeString(this.documentTypeString);
      this.icondocument = getIcon(this.documentTypeString);
      this.CarMatricule = this.route.snapshot.params['matricule'];
     }
  ngOnInit() {
    if (this.route.snapshot.params['car']) {
      this.trackingObject = +this.route.snapshot.params['car'];
    }

    if (this.route.snapshot.params['documentId']) {
      this.documentType = +this.route.snapshot.params['documentId'];
    }
    this.dataSource = new FilesDataSource(this._documentLogService, this.paginator, this.sort);

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
  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
   /**
     * Edit Event
     *
     * @param {string} action
     * @param {Log} log
     */
    editLog(action: string, log: DocumentLogModel): void
    {
        const Index = this.logs.indexOf(log);

        this.dialogRef = this._matDialog.open(LogDialogComponent, {
            panelClass: 'custom-dialog-container',
            data      : {
                log : log,
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
                        this._documentLogService.editCarDocumentLog(formData.getRawValue());
                
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteDocumentLog(log);

                        break;
                }
            });
    }
    /**
     * Add Log
     */
    addLog(): void
    {
      const dialogRef = this._matDialog.open(LogDialogComponent, {
            panelClass: 'custom-dialog-container',
            data      : {
                action: 'new',
            }
        });
        dialogRef.afterClosed()
            .subscribe((response: any) => {
                if ( !response )
                {
                    return;
                }
                const newLog = response.getRawValue();
                this._documentLogService.addCarDocumentLog(newLog);
              
            });
    } 
    /**
     * remove log
     * **/
    deleteDocumentLog(log): void{
      this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

    this.confirmDialogRef.afterClosed().subscribe(result => {
        if ( result )
        {
            this._documentLogService.deleteCarDocumentLog(log);
        }
        this.confirmDialogRef = null;
    });
   }
  downloadPdf() {
    var prepare=[];
    this.logs.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.DateAvailableFromGMT);
      tempObj.push(e.DateAvailableToGMT);
      tempObj.push(e.Cost);
      tempObj.push(e.PaidCost);
      tempObj.push(e.PaidDateLocal);
      tempObj.push(e.Description);
      tempObj.push(e.InvoiceReference);
      tempObj.push(e.Supplier);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.autoTable({
        head: [['Validité de',"Validité jusqu'à",'Coût',"Montant payé",'Date de payement','Description','Référence','Fournisseur']],
        body: prepare
    });
    doc.save('DocumentLog_List' + '.pdf');
  } 

 /** Gets the total cost of all Logs. */
 getTotalCost() {
  return this._documentLogService.documentlogs.map(t => t.Cost).reduce((acc, value) => acc + value, 0);
}
 /** Gets the total paid cost of all logs. */
 getTotalPaidCost() {
  return this._documentLogService.documentlogs.map(t => t.PaidCost).reduce((acc, value) => acc + value, 0);
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
     * @param {DocumentLogService} _documentLogService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _documentLogService: DocumentLogService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort
    )
    {
        super();

        this.filteredData = this._documentLogService.documentlogs;
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
            this._documentLogService.onDocumentLogChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

                let data = this._documentLogService.documentlogs.slice();

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
                case 'DateAvailableFromGMT':
                    [propertyA, propertyB] = [a.DateAvailableFromGMT, b.DateAvailableFromGMT];
                    break;
                case 'DateAvailableToGMT':
                    [propertyA, propertyB] = [a.DateAvailableToGMT, b.DateAvailableToGMT];
                    break;
                case 'Cost':
                    [propertyA, propertyB] = [a.customer.Cost, b.customer.Cost];
                    break;
                case 'PaidCost':
                    [propertyA, propertyB] = [a.PaidCost, b.PaidCost];
                    break;
                case 'PaidDateGMT':
                    [propertyA, propertyB] = [a.payment.PaidDateGMT, b.payment.PaidDateGMT];
                    break;
                case 'Description':
                    [propertyA, propertyB] = [a.Description, b.Description];
                    break;
                case 'InvoiceReference':
                    [propertyA, propertyB] = [a.InvoiceReference, b.InvoiceReference];
                    break;
                case 'Supplier':
                  [propertyA, propertyB] = [a.Supplier, b.Supplier];
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
