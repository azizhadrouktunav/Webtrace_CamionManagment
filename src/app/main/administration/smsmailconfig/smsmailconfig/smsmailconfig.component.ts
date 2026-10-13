import { Component, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTabChangeEvent, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { decrypt } from 'app/main/parc/Parc';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SmsmailconfigService } from '../smsmailconfig.service';
import { TranslateService } from '@ngx-translate/core';
import { MailComponent } from '../mail/mail.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SmsComponent } from '../sms/sms.component';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';

@Component({
  selector: 'app-smsmailconfig',
  templateUrl: './smsmailconfig.component.html',
  styleUrls: ['./smsmailconfig.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SmsmailconfigComponent implements OnInit {

    dialogRef: any;
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    filterBy: string;

    // Private
    private _unsubscribeAll: Subject<any>;

    tableColumns: string[] = ['MailAdress', 'Name','actions'];
    tableColumns2: string[] = ['Tel', 'Name','actions'];
    
    @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
    @ViewChild(MatSort, { static: false }) sort: MatSort;
  
    searchkey: string;
    dataSource = new MatTableDataSource<string>();
    dataSourceTelNumber= new MatTableDataSource<string>();
  data: any;
  ListMails: any;
  id: number = 0;
  ListTels: any;
    /**
     * Constructor
     *
     * @param {SmsmailconfigService} _smsmailconfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _matDialog: MatDialog,
        private _smsmailconfigService : SmsmailconfigService,
        private _snackBar : MatSnackBar,
        private translateService: TranslateService,
        private _router : Router,
        private _errorHandler: ErrorHandlerService

    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

   
    /**
     * On init
     */
    ngOnInit(): void
    {
      this._smsmailconfigService.getAllMails().subscribe((result) => {
      
      this.ListMails = result["GetAllMailsResult"];

      this.dataSource = new MatTableDataSource(result["GetAllMailsResult"]);

      this.dataSource.paginator = this.paginator.toArray()[0];
      this.dataSource.sort = this.sort;
},
  (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
  });
         this._smsmailconfigService.getAllTelNumbers()
           .subscribe((data) => {
      
          this.ListTels = data["GetAllTelNumbersResult"];
          this.dataSourceTelNumber = new MatTableDataSource(data["GetAllTelNumbersResult"]);

          this.dataSourceTelNumber.paginator = this.paginator.toArray()[1];
          this.dataSourceTelNumber.sort = this.sort;
  
    
    },
    (err: HttpErrorResponse) => {
       //this.errorHandler.handleError(error);.handleError(err);
    });
    
this.translateService.get(['NAV.MailIsAdded', 'NAV.MailIsRemoved', 'NAV.MailIsEdited',
'NAV.msgDeleteMail','NAV.TelIsAdded','NAV.TelIsEdited','NAV.TelIsRemoved','NAV.msgDeleteTel'])
.subscribe(data => { this.data = data }
);
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * New mail
     */
    addmail(): void {

     switch(this.id)
     {
       case 0 :
     
      const dialogRef = this._matDialog.open(MailComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'add',
          data : ''
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
  
        if (!result) {
          return;
        }
          this._smsmailconfigService.addMail(result).pipe(takeUntil(this._unsubscribeAll))
             .subscribe((data: any[]) => {
  
            if (data !== null) {
              this.ListMails.unshift(data["AddMailResult"]);
  
             this.dataSource = new MatTableDataSource(this.ListMails);
             this.dataSource.paginator = this.paginator.toArray()[0];
             this.dataSource.sort = this.sort;
       
              this._snackBar.open(this.data['NAV.MailIsAdded'], 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 2000
                 })
            }
            else{
              // Show the failure message
              this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
        }
          },
          (err: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(err);
          });
        }
  
        );
  
            break;
            

      case 1 :
        const dialogRef2 = this._matDialog.open(SmsComponent, {
          panelClass: 'custom-dialog-container',
          data: {
            action: 'add',
            data : ''
            
    
          }
        });
    
        dialogRef2.afterClosed().subscribe(result => {
    
          if (!result) {
            return;
          }
            this._smsmailconfigService.addTelNumber(result).pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: any[]) => {
    
              if (data !== null) {
                this.ListTels.unshift(data["AddTelNumberResult"]);
    
               this.dataSourceTelNumber = new MatTableDataSource(this.ListTels);
               this.dataSourceTelNumber.paginator = this.paginator.toArray()[1];
               this.dataSourceTelNumber.sort = this.sort;
                this._snackBar.open(this.data['NAV.TelIsAdded'], 'OK', {
                  // here specify the position
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right' ,
                  duration  : 2000
                   })
              }
              else{
                // Show the failure message
                this._snackBar.open('Server is Not Responding', 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                duration        : 2000
                });
          }
            },
              (err: HttpErrorResponse) => {
                //this.errorHandler.handleError(error);.handleError(err);
              }); 
          }
    
    
          );
      break;}
    }

    /**
     * Edit mail
     */
    editmail(item): void {
      const dialogRef = this._matDialog.open(MailComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'edit',
          data : item
  
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
  
        if (!result) {
          return;
        }
          this._smsmailconfigService.updateMail(result,item.Id).pipe(takeUntil(this._unsubscribeAll))
          .subscribe((data: any[]) => {
            
            if (data !== null) {
              var index = index = this.ListMails.map(x => { return x.Id }).indexOf(item.Id);
              this.ListMails.splice(index, 1, data["UpdateMailResult"]);
              this.dataSource = new MatTableDataSource(this.ListMails);
              this.dataSource.paginator = this.paginator.toArray()[0];
              this.dataSource.sort = this.sort;
        
              this._snackBar.open(this.data['NAV.MailIsEdited'], 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 2000
                 })
            }
            else{
              // Show the failure message
              this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
        }
          },
          (error) => {
            this._snackBar.open(error, "s'identifier", {
              duration: 10000
            }).afterDismissed().subscribe(()=>{
              this._router.navigate(['app-auth']);
            });
            
          }

          
          );
        }
  
  
        );
  
     
    }
    removemail(item) {
      const dialogRef =this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      dialogRef.componentInstance.confirmMessage = this.data['NAV.msgDeleteMail'];
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._smsmailconfigService.removeMail(item).pipe(takeUntil(this._unsubscribeAll)).subscribe((data) => {
  
            if (data["RemoveMailResult"] !== false) {
              const Index = this.ListMails.indexOf(item);
              this.ListMails.splice(Index, 1);
              this.dataSource.paginator = this.paginator.toArray()[0];
              this.dataSource.sort = this.sort;
        
              this.dataSource = new MatTableDataSource(this.ListMails);
              this._snackBar.open(this.data['NAV.MailIsRemoved'], 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 2000
                 })
            }
            else{
              // Show the failure message
              this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
        }
          });
        }
      })
    }
    /**
     * Edit tel
     */
    edittel(item): void {
      const dialogRef = this._matDialog.open(SmsComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          action: 'edit',
          data : item
  
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
  
        if (!result) {
          return;
        }
          this._smsmailconfigService.updateTelNumber(result,item.Id).pipe(takeUntil(this._unsubscribeAll))
          .subscribe((data: any[]) => {
  
            if (data !== null) {
              var index = index = this.ListTels.map(x => { return x.Id }).indexOf(item.Id);
              this.ListTels.splice(index, 1, data["UpdateTelNumberResult"]);
              this.dataSourceTelNumber = new MatTableDataSource(this.ListTels);
              this.dataSourceTelNumber.paginator = this.paginator.toArray()[1];
              this.dataSourceTelNumber.sort = this.sort;
              this._snackBar.open(this.data['NAV.TelIsEdited'], 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 2000
                 })
            }
            else{
              // Show the failure message
              this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
        }
          },
          (err: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(err);
          }); 
        }
  
  
        );
  
     
    }
    applyfilter()
    {
      this.dataSource.filter = this.searchkey.trim().toLowerCase();
      this.dataSourceTelNumber.filter = this.searchkey.trim().toLowerCase();

    }
    removetel(item) {
      const dialogRef =this._matDialog.open(FuseConfirmDialogComponent, {
        disableClose: false
      });
      dialogRef.componentInstance.confirmMessage = this.data['NAV.msgDeleteTel'];
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._smsmailconfigService.removeTelNumber(item).pipe(takeUntil(this._unsubscribeAll))
          .subscribe((data) => {
  
            if (data["RemoveTelNumberResult"] !== false) {
              const Index = this.ListTels.indexOf(item);
              this.ListTels.splice(Index, 1);
  
              this.dataSourceTelNumber = new MatTableDataSource(this.ListTels);
              this.dataSourceTelNumber.paginator = this.paginator.toArray()[1];
              this.dataSourceTelNumber.sort = this.sort;
              this._snackBar.open(this.data['NAV.TelIsRemoved'], 'OK', {
                // here specify the position
                verticalPosition: 'bottom',
                horizontalPosition: 'right' ,
                duration  : 2000
                 })
            }
            else{
              // Show the failure message
              this._snackBar.open('Server is Not Responding', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
        }
          },
          (err: HttpErrorResponse) => {
            //this.errorHandler.handleError(error);.handleError(err);
          });
        }
      })
    }
    tabChanged(tabChangeEvent: MatTabChangeEvent): void {
      
      this.id = tabChangeEvent.index;
   }

   navigatetoconfig(item) {
    //initialize values to send
   
    this._router.navigate(['/administration/smsmailconfig/config',this.id, item.Id]);
  }
}
