import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { json2array } from 'app/main/helpers/must-match.validator';
import { PaymentlogComponent } from 'app/main/parc/Dialogs/paymentlog/paymentlog.component';
import { RenewContactComponent } from 'app/main/parc/Dialogs/renew-contact/renew-contact.component';
import { DocumentLogService } from 'app/main/parc/document/documenthistory/document-log.service';
import { DocumentmanagmentService } from 'app/main/parc/document/documentmanagment.service';
import { DocumentLogModel } from 'app/main/parc/document/documentModel';
import { LogDialogComponent } from 'app/main/parc/document/log-dialog/log-dialog.component';
import { AccidentDetails } from 'app/main/parc/interfaces/accidentdetails';
import { BorrowedModel } from 'app/main/parc/interfaces/borrowedrentalModel';
import { PaymentModel } from 'app/main/parc/interfaces/paymentModel';
import { RepairMaintenanceLog } from 'app/main/parc/maintenance/department';
import { MaintenanceService } from 'app/main/parc/maintenance/maintenance.service';
import { RepairFormComponent } from 'app/main/parc/maintenance/repairs/repair-form/repair-form.component';
import { AccidentdetailsService } from 'app/main/parc/services/accidentdetails.service';
import { BorrowedRentalService } from 'app/main/parc/services/borrowedrental.service';
import { isEmpty } from 'lodash';
import { isNullOrUndefined } from 'util';


export class reminder {
    id : number;
    label: string;
    description: string;
    img: string;
    constructor(id: number, label:string, description: string, 
        img:string) {
      this.id = id;
      this.label = label;
      this.description = description;
      this.img = img;
    }
  } 
@Component({
    selector: 'app-maintenance-list',
    templateUrl: './maintenance-list.component.html',
    styleUrls: ['./maintenance-list.component.scss']
})
export class MaintenanceListComponent  {
    
    reminderList : any[] = [];
    id: number;
  //  list = [];
    trackingObject: string;
    matricule:string;
    img: string;
    constructor(
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef <MaintenanceListComponent> ,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _maintenanceService: MaintenanceService,
        private _snackBar: MatSnackBar,
        private _documentmanagmentService: DocumentmanagmentService,
        private _borrowedRentalService : BorrowedRentalService,
        private _accidentdetailsService:  AccidentdetailsService,
        private _errorHandler: ErrorHandlerService) {

        this.img = "./assets/icons/FlatIcons/png/"+ data.img;
        this.matricule = data.matricule;
        this.id = +data.id;
        this.reminderList = json2array(data.cell);
    }

    // OK
    adjustMaintenance(reminder : any) {

        const dialogRef = this._matDialog.open(RepairFormComponent, {
            panelClass: 'custom-dialog-container',
            data: {
                action: 'adjust',
                repair: new RepairMaintenanceLog({Id: reminder.Id, MaintenanceTypeStr: reminder.MaintenanceTypeString,
                    Car: reminder.Car,EngineHoursCompletion: reminder.CurrentEngineHours , MileageCompletion: reminder.CurrentMileage})
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if ( !result )
                    {
                        return;
                    }
            const newLog = result.getRawValue();
            this._maintenanceService.confirmMaintenance(reminder.Id, newLog).subscribe(data=>{ 
              if(!isNullOrUndefined(data))
              { 
                // remove item in mat-list 
                 this.removeListReminder(reminder);
                this._snackBar.open(data.MaintenanceTypeString + ' was successfully adjusted ', 'OK' , {
                  duration: 5000,
                    // here specify the position
                  verticalPosition: 'top',
                  horizontalPosition: 'right'
                });
              }
             
                
              });
          })
    }
    // OK
    adjustDocument(reminder : any) {
        
        const dialogRef = this._matDialog.open(LogDialogComponent, {
            panelClass: 'custom-dialog-container',  
            data: {
              action: 'adjust',
              log: new DocumentLogModel(reminder)
            }     
          });
      
          dialogRef.afterClosed().subscribe((result: any) => {
            
            if ( !result )
            {
                return;
            }
            const newAdjust = result.getRawValue();
            this._documentmanagmentService.adjustCarDocumentLog(newAdjust, reminder).then(() => {
              this.removeListReminder(reminder);
            });
          });
    }
    //OK 
    adjustPayment(reminder) {
        console.log(reminder);
        const dialogRef = this._matDialog.open(PaymentlogComponent, {
            panelClass: ['event-form-dialog', 'custom-dialog-container'],
            data: {
                action: 'adjust'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if ( !result )
                    {
                        return;
                    }
            this._borrowedRentalService.adjustContract(reminder.Car,reminder.Id,result).subscribe((data: any)=>{ 
                if(data != {}) {

                  this._snackBar.open('Contract Invoice was successfully adjusted ', 'OK' , {
                    duration: 5000,
                     // here specify the position
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                  });
                  this.removeListReminder(reminder);
                }
               
              },
              (err: HttpErrorResponse) => {
                  //this.errorHandler.handleError(error);.handleError(err);
              });
          })
    }
    // Ok
  adjustExpiredContract(reminder) {

          const dialogRef = this._matDialog.open(RenewContactComponent,{
            panelClass: 'custom-dialog-container',
            data:{
              element: new BorrowedModel(reminder)
              }
          });
          dialogRef.afterClosed().subscribe((result) => {
           
            if ( !result )
                    {
                        return;
                    }
                               
            this._borrowedRentalService.confirmBorrowedRuntedEndOrRenewContractImplementation(reminder.Car, reminder.Id, result)
            .subscribe((data: any) => { 
             
            this._snackBar.open('Car  Contract was renew successfully ', 'OK' , {
                    duration: 5000,
                     // here specify the position
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                  });
                  this.removeListReminder(reminder);
              },
              (err: HttpErrorResponse) => {
                //this.errorHandler.handleError(error);.handleError(err);
              }); 
            
          });
    }
    // Ok
  adjustAccident(reminder: any) {
        const dialogRef = this._matDialog.open(RepairFormComponent, {
            panelClass: 'custom-dialog-container',
            data: {
                action: 'adjust',
                repair: new RepairMaintenanceLog({Id: reminder.Id, Car: reminder.Car, MileageCompletion: +this.data.mileageFloat}),
                show: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if ( !result )
                    {
                        return;
                    }
            const newLog = result.getRawValue();
            this._accidentdetailsService.closeAccidentDetailsImplementation(newLog).subscribe(data=>{ 
              if(!isNullOrUndefined(data))
              {  
                this._snackBar.open('Accident was successfully adjusted ', 'OK' , {
                  duration: 5000,
                    // here specify the position
                  verticalPosition: 'top',
                  horizontalPosition: 'right'
                });
                this.removeListReminder(reminder);
              } 
              },
              (err: HttpErrorResponse) => {
                //this.errorHandler.handleError(error);.handleError(err);
              });
          })
    }
  parseJsonDate(value: string) {
        return new Date(parseInt(value.substr(6)))
    }
  // test if reminderList isEmpty
    removeListReminder(reminder: any) : void {
      this.reminderList = this.reminderList.filter(element => element !== reminder);
      if(isEmpty(this.reminderList))
           this.dialogRef.close();

    }
}

