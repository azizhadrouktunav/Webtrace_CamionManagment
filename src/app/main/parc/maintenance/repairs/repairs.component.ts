import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { RepairMaintenanceLog, _MaintenanceTypeEnum, validateDates } from '../department';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatTable} from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import * as _ from 'lodash';
import { RepairsService } from './repairs.service';
import { fuseAnimations } from '@fuse/animations';
import { RepairFormComponent } from './repair-form/repair-form.component';
import { take } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html',
  styleUrls: ['./repairs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class RepairsComponent implements OnInit, OnChanges  {

displayedColumns_ = ['DateCompletion','MileageCompletion', 'Cost', 'PaidCost', 'PaidDate', 'Description','InvoiceReference', 'Supplier', 'MaintenanceType','actions'];
dataSource = new MatTableDataSource<RepairMaintenanceLog>();
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
@ViewChild(MatSort, { static: true }) sort: MatSort;
@ViewChild(MatTable,{static:true}) table: MatTable<any>;
start:Date = new Date();
end:Date = new Date();

dateForm: FormGroup;
RepairMaintenances: RepairMaintenanceLog[] = [];
confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
dialogRef: any;
whichButton;
//selectedValue: number;
types : any[];
@Input() id: number; // decorate the property with @Input()
@Input() searchkey: string; // decorate the property with @Input()
 //Error Display
 error:any={isError:false,errorMessage:''};
 isValidDate:any;
 @Input('newRepair') newRepair: RepairMaintenanceLog;
  constructor(
    private formBuilder: FormBuilder,
    private repairsService: RepairsService,
    private _matDialog: MatDialog,
    private _matSnackBar: MatSnackBar) { 
     
    this.dateForm = this.formBuilder.group({
      start: [this.start, Validators.required],
      end:  [this.end, Validators.required],
    });
  }

  ngOnInit() {
    this.types = _MaintenanceTypeEnum ;
    this.dataSource.data = this.RepairMaintenances;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnChanges(changes: SimpleChanges) {
 
    for (let property in changes) {
        if (property === 'newRepair') {
                   this.dataSource.data.unshift(changes[property].currentValue);
                   this.dataSource.data =  this.dataSource.data;
                  // this.table.renderRows();
         
         
        } 
    }
}
checkFormValidity():boolean {       
  if(this.start instanceof Date && this.end instanceof Date) {
    return this.dateForm.valid;
  }
  else {
    return false
  }
 
}

editRepair(action:String, repair:RepairMaintenanceLog): void 
{ 
  const repairIndex = this.dataSource.data.indexOf(repair);

  this.dialogRef = this._matDialog.open(RepairFormComponent, {
      panelClass: ['event-form-dialog', 'custom-dialog-container'],
      data      : {
          repair : repair,
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
                  this.repairsService.updateRepairMaintenanceLog(formData.getRawValue()).subscribe(data => {
                    if(data){
                      this.dataSource.data = this.dataSource.data.filter((value, key) => {
                        if(value.Id == repair.Id) {
                          value = data;
                        }
                  // Show the success message
                this._matSnackBar.open('Repair updated', 'OK', {
                  verticalPosition: 'top',
                  duration        : 2000
                      });
                        return true;
                      });
                    }
                    else {
                      // Show the failure message
                  this._matSnackBar.open('Server not responding', 'OK', {
                    // here specify the position
                    verticalPosition: 'top',
                    duration        : 2000
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
        this.repairsService.deleteRepairMaintenanceLog(this.id , repair.Id, +repair.MaintenanceReminder).subscribe(data => {
          if(data){
            this.dataSource.data = this.dataSource.data.filter((value, key) => {
              return value.Id != repair.Id;
            });
              // Show the success message
          this._matSnackBar.open('Repair deleted', 'OK', {
            // here specify the position
            verticalPosition: 'top',
            //horizontalPosition: 'right',
            duration        : 2000
            });
          }
        },
        error => {
          console.info(error);
                // Show the failure message
                this._matSnackBar.open('Server is Not Responding', 'OK', {
                  // here specify the position
                  verticalPosition: 'top',
                  //horizontalPosition: 'right',
                  duration        : 2000
                  });
        });
    }
    this.confirmDialogRef = null;
});
}
// add repair
AddRepair():void{
  this.dialogRef = this._matDialog.open(RepairFormComponent, {
    panelClass: ['event-form-dialog', 'custom-dialog-container'],
    data      : {
        action: 'new',
        show: true
             }
});
  this.dialogRef.afterClosed()
  .subscribe((response: FormGroup) => {
      if ( !response )
      {
          return;
      }
      const newRepair = response.getRawValue();
      this.repairsService.addRepairMaintenanceLog(newRepair).subscribe(value => {
                if(value){
                 this.dataSource.data.unshift(new RepairMaintenanceLog(value));
                 this.dataSource.data =  this.dataSource.data;
                 this.table.renderRows();
                 // Show the success message
                 this._matSnackBar.open('Repair added', 'OK', {
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
downloadPdf() {
  var prepare=[];
  
  this.dataSource.data.forEach(e=>{
    var tempObj =[];
   
    tempObj.push(e.Car);
    tempObj.push(e.MaintenanceTypeStr)
    tempObj.push(e.Driver);
    tempObj.push(e.DateAvailableFromLocal.getDate())
    tempObj.push(e.MileageCompletion);
    tempObj.push(e.EngineHoursCompletion);
    tempObj.push(e.DateCompletionLocal.getDate());
    tempObj.push(e.InvoiceReference);
    prepare.push(tempObj);
  });
  const doc = new jsPDF();
  var header = function(data){
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
    doc.text("ETAT SUIVI DES REPARATIONS", data.settings.margin.left, 50);
    doc.text("Relevé du"+ this.start + "au"+ this.end , data.settings.margin.left, 30);
          };
  doc.autoTable({
      head: [['Numéro de série','Type de voiture','Chauffeur','Date de mise en circulation' , 'Kilometrage' , 'Montant de taxe', "Montant d'assurance", "Montant d'achat"]],
      body: prepare,
      startY: 20
  });
  doc.save('suivi des reparations' + '.pdf');
}
exportExcel() : void {
  var prepare_to_excel=[];
  let tem =[];
  tem.push("Date d'achèvement");
  tem.push("Kilométrage d'achèvement");
  tem.push('Coût');
  tem.push("Coût payé");
  tem.push('Date de paiement');
  tem.push('Description');
  tem.push('Référence de facture');
  tem.push('Fournisseur');
  tem.push("Type d'entretien");
  prepare_to_excel.push(tem);
  this.dataSource.data.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.DateCompletionLocal);
    tempObj.push(e.MileageCompletion);
    tempObj.push(e.Cost);
    tempObj.push(e.PaidCost);
    tempObj.push(e.PaidDateLocal);
    tempObj.push(e.Description);
    tempObj.push(e.InvoiceReference);
    tempObj.push(e.Supplier);
    tempObj.push(e.MaintenanceTypeStr);
    prepare_to_excel.push(tempObj);
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, 'Journal_réparation.xls', { bookType: 'xls', type: 'buffer' });
}
onSubmit()
{
  this.isValidDate = validateDates(this.start , this.end)
  if(this.isValidDate){

    this.RepairMaintenances.length = 0;
    this.repairsService.getRepairMaintenances(this.id, this.dateForm.get('start').value, this.dateForm.get('end').value).subscribe((data:RepairMaintenanceLog[]) => {
    
      data.forEach(elt => {
        this.RepairMaintenances.push(new RepairMaintenanceLog(elt));
      },
      error => {console.info(error)});
      this.dataSource.data = this.RepairMaintenances;
      }
     )
    }
}
}
