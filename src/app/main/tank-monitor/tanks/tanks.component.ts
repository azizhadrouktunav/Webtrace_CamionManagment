import { DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Tank } from 'app/main/parc/tank/model';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { TankFormDialogComponent } from '../tank-form-dialog/tank-form-dialog.component';
import { TankMonitorService } from '../tank-monitor.service';
import { TanksService } from './tanks.service';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from  '../../../navigation/i18n/fr';
import { locale as arab } from  '../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'tanks',
  templateUrl: './tanks.component.html',
  styleUrls: ['./tanks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class TanksComponent implements OnInit, AfterViewInit  {
  
  displayedColumns: string[] = ['name', 'capacity', 'FuelType', 'fuelLevel', 'refuelling', 'draining', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dataSource: MatTableDataSource<any>;
  searchkey: string;
  departments: any;
  ServerMsg: string;
    // Private
    private _unsubscribeAll: Subject<any>;
  constructor(
    private _matDialog: MatDialog,
    private _tanksService: TanksService,
    private _matSnackBar: MatSnackBar,
    private errorHandler : ErrorHandlerService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _TranslateService: TranslateService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
   }

  ngOnInit() {
    
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._tanksService.onTanksChanged
    .subscribe(data => {
        this.dataSource.data = data.map(t => new Tank(t));
    });
    //this.dataSource.filteredData

  //   .pipe(
  //     takeUntil(this._unsubscribeAll),
  //     debounceTime(150),
  //     distinctUntilChanged()
  // )
  // .subscribe(data => {
  //  console.log(data);
  // });
  this.departments = this._tanksService.departments;
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  addTank() : void {
     this.dialogRef = this._matDialog.open(TankFormDialogComponent, {
      panelClass: 'tank-form-dialog',
       data: {
         action: 'new',
         departments: this.departments,
         names : this.dataSource.data.map(t => t.Name)
       }
     });
     this.dialogRef.afterClosed()
       .subscribe((response: FormGroup) => {
        if(!response) {
            return;
        }
        const newTank = response.getRawValue();
        this._tanksService.addTank(newTank).subscribe((data: any) => {
          const dataSource = this.dataSource.data;
          var newTank = new Tank(data);
           if(newTank.Id > 0)
            {
              this._TranslateService.get('SuccessMsgAddedTank').subscribe(result => {
                this.ServerMsg = result;
              });
              dataSource.push(newTank);
              this.dataSource.data = dataSource;
              this._matSnackBar.open(this.ServerMsg, 'OK' , {
                //here specify the position
               verticalPosition: 'bottom',
               horizontalPosition: 'right',
               duration: 2000
              });
            }
           else
           {
            this._TranslateService.get('ServerMsg').subscribe(result => {
              this.ServerMsg = result;
            });
            this._matSnackBar.open(this.ServerMsg, 'OK' , {
              //here specify the position
             verticalPosition: 'bottom',
             horizontalPosition: 'right',
             duration: 2000
            });
           }
        },
      (error: HttpErrorResponse) => {
          //this.errorHandler.handleError(error);
   }) 
  });
}
updateTank(tank): void {
   
  this.dialogRef = this._matDialog.open(TankFormDialogComponent, {
    panelClass: 'tank-form-dialog',
    data      : {
      tank: tank,
        action : 'edit',
        departments:this.departments,
        names : this.dataSource.data.filter(t => t.Id != tank.Id).map(t => t.Name)
    }
});
  this.dialogRef.afterClosed()
      .subscribe(response => {
          if(!response)
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

                this._tanksService.editTank(formData.getRawValue()).subscribe(data => {
                  if(!isNullOrUndefined(data))
                     {
                      var updatedTank = new Tank(data);
                      // Find item index using _.findIndex (thanks @AJ Richardson for comment)
                      var index = this.dataSource.data.indexOf(tank);
 
 
                     // Replace item at index using native splice
                     this.dataSource.data.splice(index, 1, updatedTank);
                     this.dataSource.data = this.dataSource.data;
                     this._TranslateService.get('SuccessMsgUpdatedTank').subscribe(result => {
                      this.ServerMsg = result;
                    });
                 
                     this._matSnackBar.open(this.ServerMsg, 'OK' , {
                       //here specify the position
                      verticalPosition: 'bottom',
                      horizontalPosition: 'right',
                      duration: 4000
                     });
                     }
                  else 
                  {
                    this._TranslateService.get('ServerMsg').subscribe(result => {
                      this.ServerMsg = result;
                    });
                    
                    this._matSnackBar.open(this.ServerMsg , 'OK' , {
                      //here specify the position
                     verticalPosition: 'bottom',
                     horizontalPosition: 'right',
                     duration: 2000
                    });
                  }

                }, 
                (error: HttpErrorResponse) => {
                  //this.errorHandler.handleError(error);
           });

                break;
            /**
             * Delete
             */
            case 'delete':

                this.deleteTank(tank);

                break;
        }
      })
}
deleteTank(element: Tank): void {
    
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});

var confirmMessage = '';
this._TranslateService.get('confirmMessageDelTank').subscribe(result => {
  confirmMessage = result;
});
this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;

this.confirmDialogRef.afterClosed().subscribe(result => {
    if ( result )
    {
      var MsgDeleting = '';
      var tank = '';

       
      this._TranslateService.get('Tank').subscribe(result => {
          tank = result;
      });
        this._tanksService.deleteTank(element)
        .subscribe((data: boolean) => {
          if(data == true) {
            
            this._TranslateService.get('SuccessMsgDeleteTank').subscribe(result => {
              MsgDeleting = result;
            });
            this._matSnackBar.open(MsgDeleting + '!', '', {duration: 2500});
            const Index = this.dataSource.data.indexOf(element);
            this.dataSource.data.splice(Index, 1);
  
            this._tanksService.onTanksChanged.next( this.dataSource.data);
          }
          else if(data == false) {
            
            this._TranslateService.get('MsgDeleting').subscribe(result => {
              MsgDeleting = result;
            });
            this._matSnackBar.open( tank+ element.Name + MsgDeleting, '', {duration: 2500});
          }
      },
      (error: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);
      })
         
    }
});

}
}

// export class FilesDataSource extends DataSource<any>
// {
//     private _filterChange = new BehaviorSubject('');
//     private _filteredDataChange = new BehaviorSubject('');

//     /**
//      * Constructor
//      *
//      * @param {TanksService} _tanksService
//      * @param {MatPaginator} _matPaginator
//      * @param {MatSort} _matSort
//      */
//     constructor(
//         private _tanksService: TanksService,
//         private _matPaginator: MatPaginator,
//         private _matSort: MatSort
//     )
//     {
//         super();

//         this.filteredData = this._tanksService.tanks;
//     }

//     /**
//      * Connect function called by the table to retrieve one stream containing the data to render.
//      *
//      * @returns {Observable<any[]>}
//      */
//     connect(): Observable<any[]>
//     {
//         const displayDataChanges = [
//             this._tanksService.onTanksChanged,
//             this._matPaginator.page,
//             this._filterChange,
//             this._matSort.sortChange
//         ];

//         return merge(...displayDataChanges)
//             .pipe(
//                 map(() => {
//                         let data = this._tanksService.tanks.slice();

//                         data = this.filterData(data);

//                         this.filteredData = [...data];

//                         data = this.sortData(data);

//                         // Grab the page's slice of data.
//                         const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
//                         return data.splice(startIndex, this._matPaginator.pageSize);
//                     }
//                 ));
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     // Filtered data
//     get filteredData(): any
//     {
//         return this._filteredDataChange.value;
//     }

//     set filteredData(value: any)
//     {
//         this._filteredDataChange.next(value);
//     }

//     // Filter
//     get filter(): string
//     {
//         return this._filterChange.value;
//     }

//     set filter(filter: string)
//     {
//         this._filterChange.next(filter);
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Filter data
//      *
//      * @param data
//      * @returns {any}
//      */
//     filterData(data): any
//     {
//         if ( !this.filter )
//         {
//             return data;
//         }
//         return FuseUtils.filterArrayByString(data, this.filter);
//     }

//     /**
//      * Sort data
//      *
//      * @param data
//      * @returns {any[]}
//      */
//     sortData(data): any[]
//     {
//         if ( !this._matSort.active || this._matSort.direction === '' )
//         {
//             return data;
//         }

//         return data.sort((a, b) => {
//             let propertyA: number | string = '';
//             let propertyB: number | string = '';

//             switch ( this._matSort.active )
//             {
//                 case 'id':
//                     [propertyA, propertyB] = [a.id, b.id];
//                     break;
//                 case 'name':
//                     [propertyA, propertyB] = [a.name, b.name];
//                     break;
//                 case 'categories':
//                     [propertyA, propertyB] = [a.categories[0], b.categories[0]];
//                     break;
//                 case 'price':
//                     [propertyA, propertyB] = [a.priceTaxIncl, b.priceTaxIncl];
//                     break;
//                 case 'quantity':
//                     [propertyA, propertyB] = [a.quantity, b.quantity];
//                     break;
//                 case 'active':
//                     [propertyA, propertyB] = [a.active, b.active];
//                     break;
//             }

//             const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//             const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//             return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
//         });
//     }

//     /**
//      * Disconnect
//      */
//     disconnect(): void
//     {
//     }
// }