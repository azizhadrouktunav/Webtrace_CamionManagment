import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { fuseAnimations } from '@fuse/animations';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource, MatPaginator, MatSort, MatTable, MatSnackBar } from '@angular/material';
import { RepairMaintenanceLog } from '../../maintenance/department';
import { AccidentdetailsService } from '../../services/accidentdetails.service';
import { DatacService } from '../../services/datac.service';
import { RepairsService } from '../../maintenance/repairs/repairs.service';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { RepairFormComponent } from '../../maintenance/repairs/repair-form/repair-form.component';
import { isNullOrUndefined } from 'util';


interface Total { total: number }
type RepairMaintenanceLogOrTotal = RepairMaintenanceLog | Total;
@Component({
  selector: 'app-achievedmaintenance',
  templateUrl: './achievedmaintenance.component.html',
  styleUrls: ['./achievedmaintenance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AchievedmaintenanceComponent implements OnInit, OnDestroy {
  // Private
  res: RepairMaintenanceLog[] =[];
  repairs: RepairMaintenanceLog[] = [];
  carId:number;
  idAccident:number;
  Id:number;
  DateCompletionLocal:Date;
  DateCompletionGMT:Date;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;
  tableFooterColumns: string[] = [ 'Cost', 'PaidCost'];
  displayedColumns_ = [ 'DateCompletion', 'MileageCompletion' , 'Cost', 'PaidCost' , 'PaidDate', 'Description' , 'InvoiceReference', 'Supplier', 'actions'];
  dataSource = new MatTableDataSource<RepairMaintenanceLog>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatTable,{static:true}) table: MatTable<any>;
  private _unsubscribeAll: Subject<any>;
  car:number ;
  maintenance: number;  
  data: any;
  accidentdetails: RepairMaintenanceLog[];
  CarMatricule: string;
  disabled : false;
  searchkey: string;

   /**
     * Constructor
     *
     * @param {MaintenanceService} _maintenanceService
     * 
     */
  constructor(
    private route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _accidentdetailsService: AccidentdetailsService,
    private dataService: DatacService,
    private repairsService: RepairsService,
    private _matSnackBar: MatSnackBar,
    private router : Router) { 
         // Set the private defaults
         this._unsubscribeAll = new Subject();

  }

  ngOnInit() { 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.route.snapshot.params['trackingObject']) {
      this.car = +this.route.snapshot.params['trackingObject'];
    }

    if (this.route.snapshot.params['accidentId']) {
    
      this.idAccident = +this.route.snapshot.params['accidentId'];
    }

    if (this.route.snapshot.params['CarMatricule']) {
      this.CarMatricule = this.route.snapshot.params['CarMatricule'];
    }
    this.dataService.sendParams(this.car, 1);

 this._accidentdetailsService.GetRepairMaintenanceLog(this.car,this.idAccident).subscribe((result) => {
  this.data = !isNullOrUndefined(json2array(result)) ?json2array(result) : [];
  this.accidentdetails = [];
  this.data.forEach(elt => {
    this.accidentdetails.push(new RepairMaintenanceLog(elt));
  })
  this.dataSource = new MatTableDataSource(this.accidentdetails);
  this.dataSource.sort = this.sort;
  this.dataSource.paginator = this.paginator;
});
}
  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  getCurrentAccidentLog(id : number): RepairMaintenanceLog{
    return this.accidentdetails.find(it => it.AccidentDetails == id)
  }
  addRepair(){
    this.dialogRef = this._matDialog.open(RepairFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
         
        action: 'newRepair',
        show: false
               }
  });
    this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
        if ( !response )
        {
            return;
        }
        const newRepair = response.getRawValue();
        this.maintenance = -1;
        this._accidentdetailsService.addRepairMaintenanceLog(newRepair, this.car, this.maintenance,this.idAccident).subscribe(value => {
                 
                   this.dataSource.data.unshift(new RepairMaintenanceLog(value));
                   this.dataSource.data =  this.dataSource.data;
                   this.table.renderRows();
                   // Show the success message
                   this._matSnackBar.open('Log added', 'OK', {
                  verticalPosition: 'top',
                  duration        : 2000
                    });
                  
                  },
                  error => {
                    if(error.error == "Session was terminated")
        {
          this._matSnackBar.open("votre session est expirée!", "s'identifier", {
            duration: 10000
          }).afterDismissed().subscribe(()=>{
            this.router.navigate(['app-auth']);
          });
        } 

        else{
          this._matSnackBar.open('Server is Not Responding', 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            duration        : 2000
            });
        }
                 })
        })
      }
  editRepair(action:String, repair:RepairMaintenanceLog): void 
      {
        console.log(repair);
        const repairIndex = this.dataSource.data.indexOf(repair);
      
        this.dialogRef = this._matDialog.open(RepairFormComponent, {
            panelClass: ['event-form-dialog', 'custom-dialog-container'],
            data      : {
                repair : repair,
                action: action,
                show: false
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
                      this.repairsService.updateRepairMaintenanceLog(formData.getRawValue(),-1, -1, this.idAccident, -1).subscribe(data => {
                           if(data){
                            this.dataSource.data = this.dataSource.data.filter((value, key) => {
                              if(value.Id == repair.Id) {
                                value = data;
                              }
                              return true;
                            });
                          }
                        },
                        error => {
                          console.info(error);
      
                        }) 
                        this.dataSource.data[repairIndex] = Object.assign(this.dataSource.data[repairIndex], formData.getRawValue());
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
      
                       this.deleteRepair(repair);
                        break;
                }
            });
      }
      deleteRepair(repair:RepairMaintenanceLog){
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });
      
      this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';
      
      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              this.repairsService.deleteRepairMaintenanceLog(this.car , repair.Id, -1, repair.AccidentDetails).subscribe(data => {
                if(data){
                  this.dataSource.data = this.dataSource.data.filter((value, key) => {
                    return value.Id != repair.Id;
                  });
                }
              },
              error => {
                console.info(error);
                if(error.error == "Session was terminated")
                {
                  this._matSnackBar.open("votre session est expirée!", "s'identifier", {
                    duration: 10000
                  }).afterDismissed().subscribe(()=>{
                    this.router.navigate(['app-auth']);
                  });
                } 
        
                else{
                  this._matSnackBar.open('Server is Not Responding', 'OK', {
                    // here specify the position
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    duration        : 2000
                    });
                }
              })
              //const eventIndex = this.events.indexOf(event);
              //this.events.splice(eventIndex, 1);
          }
          this.confirmDialogRef = null;
      });
      }  
  /** Gets the total cost of all entretiens. */
  getTotalCost() {
    return this.dataSource.data.map(t => t.Cost).reduce((acc, value) => acc + value, 0);
  }
   /** Gets the total paid cost of all entretiens. */
   getTotalPaidCost() {
    return this.dataSource.data.map(t => t.PaidCost).reduce((acc, value) => acc + value, 0);
  }

  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
}


