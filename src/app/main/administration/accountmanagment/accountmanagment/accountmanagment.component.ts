import { Component, OnInit, ViewChild } from '@angular/core';
import { result } from 'lodash';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { AccountpopupComponent } from '../accountpopup/accountpopup.component';
import { Subscription, Subject } from 'rxjs';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AdministrationService } from '../administration.service';
import { DataService } from '../data.service';
import { TranslateService } from '@ngx-translate/core';
import { UpdatepasswordComponent } from '../updatepassword/updatepassword.component';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';

@Component({
  selector: 'app-accountmanagment',
  templateUrl: './accountmanagment.component.html',
  styleUrls: ['./accountmanagment.component.scss']
})
export class AccountmanagmentComponent implements OnInit {
  tree: any;
  CurrentCustomerId: any;
  ListAccountElement: any;
  data: any;
  DepartmentList: any;
  AccessDepartment = [];
  ListSpeciality:any;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(private _administrationService: AdministrationService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _dataService: DataService,
    private translateService: TranslateService,
    private _errorHandler: ErrorHandlerService
  ) {
       // Set the private defaults
       this._unsubscribeAll = new Subject();
   }


  tableColumns: string[] = ['Login', 'FirstName', 'LastName', 'ControlledDepartment', 'actions'];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  searchkey: string;
  dataSource = new MatTableDataSource<string>();
  destroy: Subject<boolean> = new Subject<boolean>();

  ngOnInit() {

     this._administrationService.getUIAccountManagementParam()
     .pipe(takeUntil(this._unsubscribeAll))
     .subscribe((result) => {
      
      this.CurrentCustomerId = result["CurrentAccount"]["Customer"].Id;
      this.ListAccountElement = result["ListAccountElement"]
      this.DepartmentList = result["ListDepartment"];
      this.ListSpeciality= result["ListSpeciality"];
      this.dataSource = new MatTableDataSource(result["ListAccountElement"]);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    },
    (err : HttpErrorResponse) => {
      //this.errorHandler.handleError(error);.handleError(err);
    },
      () => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.translateService.get(['ServerNotResponding', 'NAV.AccountIsAdded', 'NAV.AccountIsEdited', 'NAV.AccountIsRemoved', 'NAV.msgDeleteAccount'])
      .subscribe(data => { this.data = data }
      );
  }
 
  ngOnDestroy(): void {

     // Unsubscribe from all subscriptions
     this._unsubscribeAll.next();
     this._unsubscribeAll.complete();
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyfilter() {
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  /**
    * Add Account
    */
  addaccount(): void {
    const dialogRef = this._dialog.open(AccountpopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'add',
        Accountlist: this.dataSource,
        Department : this.DepartmentList,
        ListSpeciality:this.ListSpeciality
   
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }
      this._dataService.fetchParams().subscribe(params => {
        this.tree = params.tree;

      });
      let AccessSpeciality =[];
      this.AccessDepartment=[];
      result.Department.AccessDepartment.forEach(element => {
        
        if (element.key  != undefined)
        {
          this.AccessDepartment.push(element.key)
        }
        else{
          this.AccessDepartment.push(element)
        }
      });
      result.Department.AccessSpeciality.forEach(element => {
        
        if (element.key  != undefined)
        {
          AccessSpeciality.push(element.key)
        }
        else{
          AccessSpeciality.push(element)
        }
      });
        this._administrationService.addOrUpdateAccount(result,this.AccessDepartment,AccessSpeciality, this.tree, this.CurrentCustomerId,-1)
          .subscribe((data: any[]) => {
              //
          if (data !== null) {
            this.ListAccountElement.unshift(data);

            this.dataSource = new MatTableDataSource(this.ListAccountElement);
            this.dataSource.paginator = this.paginator;

            this._snackBar.open(this.data['NAV.AccountIsAdded'], 'OK', {
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
        (err : HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(err);
        });
      }


      );

    
  }
  editaccount(item): void {
    const dialogRef = this._dialog.open(AccountpopupComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        action: 'edit',
        item: item,
        Department : this.DepartmentList,
        ListSpeciality:this.ListSpeciality

      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }
      this._dataService.fetchParams().subscribe(params => {
        this.tree = params.tree;
      });
      //
      this.AccessDepartment = [];
      let AccessSpeciality = [];
      result.Department.AccessDepartment.forEach(element => {
        
        if (element.key  != undefined)
        {
          this.AccessDepartment.push(element.key)
        }
        else{
          this.AccessDepartment.push(element)
        }
      });
       result.Department.AccessSpeciality.forEach(element => {
        
        if (element.key  != undefined)
        {
          AccessSpeciality.push(element.key)
        }
        else{
          AccessSpeciality.push(element)
        }
      });
        this._administrationService.addOrUpdateAccount(result, this.AccessDepartment,AccessSpeciality,this.tree, this.CurrentCustomerId,item.Id)
        .subscribe((data: any[]) => {

          if (data != null) {
            
            var index = index = this.ListAccountElement.map(x => { return x.Id }).indexOf(item.Id);
            this.ListAccountElement.splice(index, 1, data);
            this.dataSource = new MatTableDataSource(this.ListAccountElement);

            this._snackBar.open(this.data['NAV.AccountIsEdited'], 'OK', {
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
        (err : HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(err);
        });
      }


      );

    
  }


  changePassword(item): void {
    const dialogRef = this._dialog.open(UpdatepasswordComponent, {
      panelClass: 'custom-dialog-container',

    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) {
        return;
      }

      this._administrationService.ChangePassword(result.password, item.Login)
      .pipe(takeUntil(this.destroy)).subscribe((data: any[]) => {

        if (data != null) {

          this._snackBar.open(this.data['NAV.AccountIsEdited'], 'OK', {
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
      (err : HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
      });

    });
  }
  /* Delete account*/
  deleteAccount(item) {
    const dialogRef = this._dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = this.data['NAV.msgDeleteAccount'];
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._administrationService.deleteAccount(item.Login).pipe(takeUntil(this.destroy))
        .subscribe((data) => {

          if (data == true) {
            const Index = this.ListAccountElement.indexOf(item);
            this.ListAccountElement.splice(Index, 1);

            this.dataSource = new MatTableDataSource(this.ListAccountElement);
            this.dataSource.paginator = this.paginator;

            this._snackBar.open(this.data['NAV.AccountIsRemoved'],'OK', {
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
        (err : HttpErrorResponse) => {
          //this.errorHandler.handleError(error);.handleError(err);
        });
      }
    })
  }
}