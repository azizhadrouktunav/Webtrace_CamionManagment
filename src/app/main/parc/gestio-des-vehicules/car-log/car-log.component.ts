import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';  
import { formatDate } from '@angular/common';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { IDepartment } from '../../maintenance/department';
import { locale as english } from '../../i18n/en';
import { locale as french } from '../../i18n/fr';
import { locale as arab } from '../../i18n/ar';
import { OperationService } from './operation.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { OperationFormDialogComponent } from './operation-form-dialog/operation-form-dialog.component';
import { FormGroup } from '@angular/forms';
import { GestionDesVehiculesService } from '../gestion-des-vehicules.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-car-log',
  templateUrl: './car-log.component.html',
  styleUrls: ['./car-log.component.scss'],
  animations   : fuseAnimations
})
export class CarLogComponent implements OnInit, OnDestroy {
  // Private
  private _unsubscribeAll: Subject<any>;
 
  operations: any[];
  constructor(private _Activatedroute:ActivatedRoute,
    private _matDialog: MatDialog,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _operationService: OperationService,
    private _vehicleServive: GestionDesVehiculesService,
    public datepipe: DatePipe,private _TranslateService: TranslateService) { 
        // Set the private defaults
        this._unsubscribeAll = new Subject();
      this._fuseTranslationLoaderService.loadTranslations(english, french, arab);}
  id: string;
  CarTitle: string;
  Car_logs = [];
  log_time_filter_object = [];
 
  displayedColumns: string[] = ['Date','Type_op','km','Cout','Chauffeur','dep','comp','Desc','comm','actions'];//
  dataSource: MatTableDataSource<any>;  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator,null) paginator: MatPaginator;
  searchkey: string;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  Display_clander = true;
  ngOnInit() {
   this._Activatedroute.params.subscribe(data => {
         this.CarTitle = data.name
    });
    this._operationService.onOperationsChanged
          .subscribe(operations => {
        this.operations = operations;
    });
    
    
    this.dataSource = new MatTableDataSource(this.operations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

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
     * Edit operation
     *
     * @param operation
     */
    editOperation(operation): void
    {  
        this.dialogRef = this._matDialog.open(OperationFormDialogComponent, {
            panelClass: 'form-dialog-operation',
            data      : {
                operation: operation,
                action : 'edit',
                drivers : this._vehicleServive.drivers,
                departments : this._vehicleServive.departments,
                accounts : this._vehicleServive.acounts

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

                        this._operationService.editOperation(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteOperation(operation);

                        break;
                }
            });
            this.getTotalCost();
    }

    /**
     * Delete Operation
     */
    deleteOperation(operation): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._operationService.deleteOperation(operation);
            }
            this.confirmDialogRef = null;
            this.getTotalCost();
        });

    }

  onfilterClear(){
    this.searchkey = "";
  }
  applyfilter(){
    this.dataSource.filter = this.searchkey.trim().toLowerCase();
  }
  update_by_date(evt, calendar){
  
    // FuseUtils.filterArrayByString(this.service.operations, )
    //   this.Display_clander = false;
    //   console.log(evt);
    //   var date = moment(evt).format("DD/MM/YYYY");
    //   this.Car_logs.forEach(e=>{
    //     if(e.OperationDateLocal == date.toString()){
    //       this.log_time_filter_object.push(e);
    //     }
    //   });
    //   this.dataSource = new MatTableDataSource(this.log_time_filter_object);
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    }
  /**
   * Gets the total cost
   **/
  getTotalCost(){
    return this._operationService.onOperationsChanged.value.map( t => t.OperationCost).reduce((acc, value) => acc + value, 0);
  }
  revive_calander(){
    this.Display_clander = true;
    this.log_time_filter_object.splice(0,this.log_time_filter_object.length);
    this.dataSource = new MatTableDataSource(this.Car_logs);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  downloadPdf(){
    var prepare=[];
    let totalcost =0;
    this.operations.forEach(e=>{
      this._TranslateService.get(['NAV'+e.Type]).subscribe(translations  => {
     
      var tempObj =[];
      let DateLocal = this.datepipe.transform(e.OperationDateLocal, 'dd/MM/yyyy');
      tempObj.push(DateLocal);
      tempObj.push(translations['NAV.'+e.Type]);
      tempObj.push(e.OperationMileage);
      tempObj.push(e.OperationCost);
      tempObj.push(e.DriverName);
      tempObj.push(e.DepartmentName);
      tempObj.push(e.Description);
      tempObj.push(e.Comment);
      prepare.push(tempObj);
      totalcost+=e.OperationCost
    });

    });
    const doc = new jsPDF();
    this._TranslateService.get(['NAV.Vehicule_op_date','NAV.Vehicule_op_type','NAV.KM','NAV.Cost_car','NAV.Driver','NAV.Departemant','NAV.Description','NAV.Commentaire','NAV.Car_log_Name','NAV.TotalCost', 'NAV.OperationHistory']).subscribe(translations  => {
      doc.text(translations['NAV.OperationHistory'] + "   " +this.CarTitle , 78, 16); 
      doc.autoTable({
        head: [[translations['NAV.Vehicule_op_date'],translations['NAV.Vehicule_op_type'],translations['NAV.KM'],translations['NAV.Cost_car'],translations['NAV.Driver'],translations['NAV.Departemant'],translations['NAV.Description'],translations['NAV.Commentaire']]],
        body: prepare,
        startY: 20
    });
 
    let finalY = doc.lastAutoTable.finalY; 
    doc.setFontSize(10);
    doc.setTextColor(255,0,0);
    doc.text(translations['NAV.Cost_car'] +":  "+totalcost, 20, finalY + 10);
    doc.setTextColor(0,0,0);
    //doc.text(this.getCoutvalue() + " TND", 40, finalY + 10);
    
     // FOOTER
     let currentDate = new Date();
     const cValue = formatDate(currentDate, 'yyyy-MM-dd hh:mm:ss', 'en-US');
     var str =  cValue;
     doc.setFontSize(10);// optional
     doc.text(str, 130, doc.internal.pageSize.height - 10);//key is the interal pageSize function

    doc.save(this.CarTitle + 'Logs.pdf');
  });
  }
  exportExcel(){
    var prepare_to_excel=[];
    let tem =[];
    this._TranslateService.get(['NAV.Vehicule_op_date','NAV.Vehicule_op_type','NAV.KM','NAV.Cost_car','NAV.Driver','NAV.Departemant','NAV.Description','NAV.Commentaire']).subscribe(translations  => {
      tem.push(translations['NAV.Vehicule_op_date']);
      tem.push(translations['NAV.Vehicule_op_type']);
      tem.push(translations['NAV.KM']);
      tem.push(translations['NAV.Cost_car']);
      tem.push(translations['NAV.Driver']);
      tem.push(translations['NAV.Departemant']);
      tem.push(translations['NAV.Description']);
      tem.push(translations['NAV.Commentaire']);
    });
   
    prepare_to_excel.push(tem);
    this.operations.forEach(e=>{
      this._TranslateService.get(['NAV.'+e.Type]).subscribe(translations  => {
      var tempObj =[];
      tempObj.push(e.OperationDateLocal);
      tempObj.push(translations['NAV.'+e.Type]);
      tempObj.push(e.OperationMileage);
      tempObj.push(e.OperationCost);
      tempObj.push(e.Driver);
      tempObj.push(e.Department);
      tempObj.push(e.Description);
      tempObj.push(e.Comment);    
      prepare_to_excel.push(tempObj);
      });
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, this.CarTitle + 'Logs.xls', { bookType: 'xls', type: 'buffer' });
  }
}

