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
import { PompeMonitorService } from '../pompe-monitor.service';
import { PompistedialogComponent } from '../pompistedialog/pompistedialog.component';
@Component({
  selector: 'app-pompistemanagment',
  templateUrl: './pompistemanagment.component.html',
  styleUrls: ['./pompistemanagment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class PompistemanagmentComponent implements OnInit {
  
  displayedColumns: string[] = ['firstname', 'lastname', 'CardId', 'actions'];
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
    private _matSnackBar: MatSnackBar,
    private errorHandler : ErrorHandlerService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _TranslateService: TranslateService,
    private _pompisteService: PompeMonitorService
  ) {
    this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
   }

  ngOnInit() {
    
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._pompisteService.getPompistes()
    .subscribe(data => {
        this.dataSource.data = data;
    });
  }

  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  
  addPompiste() : void {
     this.dialogRef = this._matDialog.open(PompistedialogComponent, {
      panelClass: 'pompiste-form-dialog',
       data: {
         action: 'new',
         names : this.dataSource.data.map(t => t.Name)
       }
     });
     this.dialogRef.afterClosed()
       .subscribe((response: FormGroup) => {
        if(!response) {
            return;
        }
         
        const newpompiste= response.getRawValue();
        this._pompisteService.addPompiste(newpompiste).subscribe((data: any) => {
          const dataSource = this.dataSource.data;
           if(data.Id > 0)
            {
              this._TranslateService.get('SuccessMsgAddedpompiste').subscribe(result => {
                this.ServerMsg = result;
              });
              dataSource.push(data);
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
updatePompiste(pompiste): void {
   
  this.dialogRef = this._matDialog.open(PompistedialogComponent, {
    panelClass: 'pompiste-form-dialog',
    data      : {
      pompiste: pompiste,
        action : 'edit',
        departments:this.departments,
        names : this.dataSource.data.filter(t => t.Id != pompiste.Id).map(t => t.Name)
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

                this._pompisteService.editPompiste(formData.getRawValue()).subscribe(data => {
                  if(!isNullOrUndefined(data))
                     {
                      var updatedpompiste= data;
                      // Find item index using _.findIndex (thanks @AJ Richardson for comment)
                      var index = this.dataSource.data.indexOf(pompiste);
 
 
                     // Replace item at index using native splice
                     this.dataSource.data.splice(index, 1, updatedpompiste);
                     this.dataSource.data = this.dataSource.data;
                     this._TranslateService.get('SuccessMsgUpdatedpompiste').subscribe(result => {
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

                this.deletePompiste(pompiste);

                break;
        }
      })
}
deletePompiste(element): void {
    
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});

var confirmMessage = '';
this._TranslateService.get('confirmMessageDelpompiste').subscribe(result => {
  confirmMessage = result;
});
this.confirmDialogRef.componentInstance.confirmMessage = confirmMessage;

this.confirmDialogRef.afterClosed().subscribe(result => {
    if ( result )
    {
      var MsgDeleting = '';
      var pompiste= '';

       
      this._TranslateService.get('pompiste').subscribe(result => {
          pompiste= result;
      });
        this._pompisteService.removePompiste(element)
        .subscribe((data: boolean) => {
          if(data == true) {
            
            this._TranslateService.get('SuccessMsgDeletepompiste').subscribe(result => {
              MsgDeleting = result;
            });
            this._matSnackBar.open(MsgDeleting + '!', '', {duration: 2500});
            const Index = this.dataSource.data.indexOf(element);
            this.dataSource.data.splice(Index, 1);
            this.dataSource.data = this.dataSource.data;

          }
          else if(data == false) {
            
            this._TranslateService.get('MsgDeleting').subscribe(result => {
              MsgDeleting = result;
            });
            this._matSnackBar.open( pompiste+ element.Name + MsgDeleting, '', {duration: 2500});
          }
      },
      (error: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);
      })
         
    }
});

}
}
