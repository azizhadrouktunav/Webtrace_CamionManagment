import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fromEvent, Subject} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { RepairMaintenanceLogService } from "./repair-maintenance-log.service";
import { IMaintenance, RepairMaintenanceLog } from "../department";
import { MaintenanceService } from '../maintenance.service';
import { RepairsService } from '../repairs/repairs.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatTableDataSource, MatPaginator, MatSort, MatTable, MatSnackBar } from '@angular/material';
import { RepairFormComponent } from '../repairs/repair-form/repair-form.component';
import { DataSource } from '@angular/cdk/table';

interface Total { total: number }
type RepairMaintenanceLogOrTotal = RepairMaintenanceLog | Total;
@Component({
  selector: 'repair-maintenance-log',
  templateUrl: './repair-maintenance-log.component.html',
  styleUrls: ['./repair-maintenance-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class RepairMaintenanceLogComponent implements OnInit, OnDestroy {
  // Private
  res: RepairMaintenanceLog[] =[];
  repairs: RepairMaintenanceLog[] = [];
  disabled;
  searchkey:string;
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
MaintenanceType : number = 0;
// vehicle name
matricule : string = '';
currentMaintenance: IMaintenance;

@ViewChild('filter', {static: true})
filter: ElementRef;
   /**
     * Constructor
     *
     * @param {RepairMaintenanceLogService} _repairMaintenanceLogService
     * @param {RepairsService} repairsService
     * 
     */
  constructor(private _repairMaintenanceLogService: RepairMaintenanceLogService,
    private route: ActivatedRoute,
    private repairsService: RepairsService,
    private _maintenanceService: MaintenanceService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar) { 
         // Set the private defaults
         this._unsubscribeAll = new Subject();

  }

  ngOnInit() {
    
    this._maintenanceService.getName()
            .subscribe(data  => {
            this.matricule = data
            });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.route.snapshot.params['car']) {
      this.car = +this.route.snapshot.params['car'];
    }

    if (this.route.snapshot.params['maintenance']) {
      this.maintenance = +this.route.snapshot.params['maintenance'];
    }
    if (this.route.snapshot.params['MaintenanceType']) {
      this.MaintenanceType = this.route.snapshot.params['MaintenanceType'];
    }
     this.currentMaintenance = this._maintenanceService.getMaintenanceById(this.maintenance);
    this._repairMaintenanceLogService.onRepairMaintenanceLogChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(data => {
              this.res = data
            });
    this.res.forEach(elt => {
      elt.MaintenanceReminder=this.maintenance;
      elt.Car=this.car;
      elt.MaintenanceType= this.MaintenanceType;
          this.repairs.push(new RepairMaintenanceLog(elt));
 });
 this.dataSource.data = this.repairs;

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


editRepair(action:String, repair:RepairMaintenanceLog): void 
{
  const repairIndex = this.dataSource.data.indexOf(repair);

  this.dialogRef = this._matDialog.open(RepairFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          repair : repair,
          action: action,
          // show type 
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
                  this.repairsService.updateRepairMaintenanceLog(formData.getRawValue(), this.car , this.maintenance).subscribe(data => {
                    if(data)
                       {
                      this.dataSource.data = this.dataSource.data.filter((value, key) => {
                        if(value.Id == repair.Id) {
                          value = data;
                        }
                      
                // Show the success message
                this._matSnackBar.open('Log updated', 'OK', {
                    verticalPosition: 'top',
                    duration        : 2000
                      });
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

addRepair(): void{
    this.dialogRef = this._matDialog.open(RepairFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {

          action: 'newRepair',
          show: false,
               }
  });
    this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
        if ( !response )
        {
            return;
        }
        const newRepair = <RepairMaintenanceLog> (response.getRawValue());
        newRepair.MaintenanceReminder=this.maintenance;
        newRepair.MaintenanceType=this.MaintenanceType;
        newRepair.Car= this.car;
        this.repairsService.addRepairMaintenanceLog(newRepair).subscribe(value => {
                  if(value){
                   this.dataSource.data.unshift(new RepairMaintenanceLog(value));
                   this.dataSource.data =  this.dataSource.data;
                   this.table.renderRows();
                   // Show the success message
                   this._matSnackBar.open('Log added', 'OK', {
                  verticalPosition: 'top',
                  duration        : 2000
                    });
                  }
                  },
                  error => {
                   console.info(error);
                 })
        })
      }
 
deleteRepair(repair:RepairMaintenanceLog){
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});

this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

this.confirmDialogRef.afterClosed().subscribe(result => {
    if ( result )
    { 
        this.repairsService.deleteRepairMaintenanceLog(repair.Car, repair.Id, repair.MaintenanceReminder).subscribe((res:boolean) => {
          if(res == true){
            const Index = this.dataSource.data.indexOf(repair);
            this.dataSource.data.splice(Index, 1);
            this.dataSource.data = this.dataSource.data; 
            this._matSnackBar.open('Log deleted', 'OK', {
              verticalPosition: 'top',
              duration        : 2000
                });
            
            }
            else {
              this._matSnackBar.open('Server Not Responding', 'OK', {
                verticalPosition: 'top',
                duration        : 2000
                  });
            }
        },
        error => {
          console.info(error);
        })
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
  downloadPdf(){};
}


