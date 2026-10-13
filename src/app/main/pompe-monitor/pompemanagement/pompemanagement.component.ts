
import { DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from  '../../../navigation/i18n/fr';
import { locale as arab } from  '../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { isNullOrUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';
import { PompedialogComponent } from '../pompedialog/pompedialog.component';
import { PompeMonitorService } from '../pompe-monitor.service';
@Component({
  selector: 'app-pompemanagement',
  templateUrl: './pompemanagement.component.html',
  styleUrls: ['./pompemanagement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PompemanagementComponent implements OnInit {
  
  displayedColumns: string[] = ['name', 'GasStationAttendant', 'equipment', 'actions'];
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
  pompistes: any;
  constructor(
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar,
    private errorHandler : ErrorHandlerService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _TranslateService: TranslateService,
    private _pompeService: PompeMonitorService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
   }

  ngOnInit() {
    
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    

    this._pompeService.getPompistes()
    .subscribe(data => {
        this.pompistes = data;

        this._pompeService.getPompes()
        .subscribe(data => {
        this.dataSource.data = data.map(p => new Pump(p,this.pompistes));
    });
    });

    
  }

  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  
  addPompe() : void {
     this.dialogRef = this._matDialog.open(PompedialogComponent, {
      panelClass: 'pompe-form-dialog',
       data: {
         action: 'new',
         pompistes : this.pompistes
       }
     });
     this.dialogRef.afterClosed()
       .subscribe((response: FormGroup) => {
        if(!response) {
            return;
        }
         
        const newPompe= response.getRawValue();
        this._pompeService.addPompe(newPompe).subscribe((data: any) => {
          const dataSource = this.dataSource.data;
           if(data.Id > 0)
            {
              this._TranslateService.get('SuccessMsgAddedPompe').subscribe(result => {
                this.ServerMsg = result;
              });
              dataSource.push(new Pump(data,this.pompistes));
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
updatePompe(Pompe): void {
   
  this.dialogRef = this._matDialog.open(PompedialogComponent, {
    panelClass: 'pompe-form-dialog',
    data      : {
         Pompe: Pompe,
        action : 'edit',
        pompistes : this.pompistes
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

                this._pompeService.editPompe(formData.getRawValue()).subscribe(data => {
                  if(!isNullOrUndefined(data))
                     {
                      var updatedPompe= new Pump(data,this.pompistes);
                      // Find item index using _.findIndex (thanks @AJ Richardson for comment)
                      var index = this.dataSource.data.indexOf(Pompe);
 
 
                     // Replace item at index using native splice
                     this.dataSource.data.splice(index, 1, updatedPompe);
                     this.dataSource.data = this.dataSource.data;
                     this._TranslateService.get('SuccessMsgUpdatedPompe').subscribe(result => {
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

                this.deletePompe(Pompe);

                break;
        }
      })
}
deletePompe(element): void {
    
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});

var confirmMessage = '';
this._TranslateService.get('confirmMessageDelPompe').subscribe(result => {
  confirmMessage = result;
});
this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;

this.confirmDialogRef.afterClosed().subscribe(result => {
    if ( result )
    {
      var MsgDeleting = '';
      var Pompe= '';

       
      this._TranslateService.get('Pompe').subscribe(result => {
          Pompe= result;
      });
        this._pompeService.removePompe(element)
        .subscribe((data: boolean) => {
         
            
            this._TranslateService.get('SuccessMsgDeletePompe').subscribe(result => {
              MsgDeleting = result;
            });
            this._matSnackBar.open(MsgDeleting + '!', '', {duration: 2500});
            const Index = this.dataSource.data.indexOf(element);
            this.dataSource.data.splice(Index, 1);
            this.dataSource.data = this.dataSource.data;

          
      },
      (error: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);
      })
         
    }
});

}
}


export class Pump {
  Id: number;
  Name: string;
  Equipment: string;
  GasStationAttendant: string;
 
  /**
     * Constructor
     *
     * @param data
     */
  constructor(data,GasStationAttendantList) {
    var now = new Date();

    // today 
    
    data = data || {};
    this.Id = data.Id || -1;
    this.Name = data.Name || '';
    this.Equipment = data.Equipment || '';
    this.GasStationAttendant = GasStationAttendantList.find(i => i.Id === data.GasStationAttendantId) || 0;
    

    
  

}}