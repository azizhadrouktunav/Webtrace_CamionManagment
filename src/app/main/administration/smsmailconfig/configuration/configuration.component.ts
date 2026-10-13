import { Component, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTabChangeEvent, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { decrypt } from 'app/main/parc/Parc';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith, map } from 'rxjs/operators';
import { SmsmailconfigService } from '../smsmailconfig.service';
import { TranslateService } from '@ngx-translate/core';
import { MailComponent } from '../mail/mail.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SmsComponent } from '../sms/sms.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Alert, getAlertString } from './Alert';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';
import { svc2date } from 'app/main/monitoring/run-stop-state/runStop';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  transform(timestamp: string): string {
    const date = new Date(parseInt(timestamp.substr(6)));
    return date.toLocaleTimeString();
  }

  
  dialogRef: any;
  hasSelectedContacts: boolean;
  searchInput: FormControl;
  filterBy: string;

  // Private
  private _unsubscribeAll: Subject<any>;


  @ViewChildren(MatPaginator, null) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private  defaultTimedb = {hour: 24, minute: 0};
  private  defaultTimedf = {hour: 23, minute: 59};

  searchkey: string;
  data: any;
  ListMails: Array<any>=[];
  id: number = 0;
  // DateDebut:Date;
  // DateFin:Date;
  ListTels: any;
  title: string;
  selectedValue= new FormControl(); ;
  result: string;
  trackingobjects = [];
  displayedColumns: string[] = ['select', 'alert','DateDebut','DateFin'];
  dataSource = new MatTableDataSource<any>();
  dataSourceSend = new MatTableDataSource<any>();

  selection = new SelectionModel<any>(true, []);
  v: any;
  values: any;
  alertsMail = [];
  send = [];
  CustomerId: any;
  emailAlert = [];
  disabled = false;
  ListSms = [];
  configlist = [];
  CarGroupOptions: Observable<CarGroup[]>;
  lastFilter: string = '';
  listcargroup: CarGroup[]=[];
  stateRecord:any = [];
  isExpandCategory: boolean[] = [];
  displayValue: string;
  ListSelectedEquip : string[]=[];
  isAllSelectedCar = false;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  /**
   * Constructor
   *
   * @param {SmsmailconfigService} _smsmailconfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private _matDialog: MatDialog,
    private _smsmailconfigService: SmsmailconfigService,
    private _snackBar: MatSnackBar,
    private translateService: TranslateService,
    private _router: Router,
    private route: ActivatedRoute,
    private _errorHandler: ErrorHandlerService

  ) {
    // Set the defaults
    this.searchInput = new FormControl('');

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }


  /**
   * On init
   */
  ngOnInit() {
    

    this.id = +this.route.snapshot.params['id'];
    this.CustomerId = +this.route.snapshot.params['CustomerId'];
    switch (this.id) {
      case 0:
        this.title = "Configuration alerte par Mail";
        break;
      case 1:
        this.title = "Configuration des alertes par SMS";
        break;
    }

    this._smsmailconfigService.getAlertConfigurationParam().subscribe((result) => {
      this.result = decrypt(result);
      this.result["ListTrackingObjects"].forEach(element => {
        if (element.CurrentEquipmentElement != null) {
          this.trackingobjects.push(element);
        }
      });
      this.listcargroup =_.chain(this.trackingobjects).groupBy("DepartmentName").map((value,key)=>({department:key,car:value,checked:false})).value();
      this.CarGroupOptions =  this.selectedValue.valueChanges.pipe(
        startWith(''),
        map(value =>typeof value === 'string' ? value: this.lastFilter),map(filter => this.filterGroup(filter))
      );



    },
    (err: HttpErrorResponse) => {
      //this.errorHandler.handleError(error);.handleError(err);
    });


    this.translateService.get(['NAV.configok', 'NAV.configfail'])
      .subscribe(data => { this.data = data }
      );
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();  
  }

  selected() {

    this.selection.clear() ;

    //this.selectedValue = e.value;
    this.alertsMail = [];
    this.emailAlert = [];
    this.send = [];
    this.ListSelectedEquip=[];
    this.selectedValue.value.forEach(element => {
      this.ListSelectedEquip.push(element.CurrentEquipmentElement.key);
    });
    switch (this.id) {
      case 0:
        
        this._smsmailconfigService.getAlertOrInputOptMailMailConfigManyEquip(this.ListSelectedEquip,this.CustomerId).subscribe((result) => {
          this.ListMails = result["GetConfAlertMailManyEquipResult"];
          let numSelection = 0;
          this.ListMails.forEach(row => {
            if (row.Send) {
              this.selection.select(row);
            }
            row.DateDebut = new Date(svc2date(row.DateDebut));
            row.DateFin = new Date(svc2date(row.DateFin));

          
                       
   });
       
   

        
          this.dataSource = new MatTableDataSource(this.ListMails);
          console.log(this.ListMails);
          this.dataSourceSend = new MatTableDataSource(this.send);
          console.log(this.send);

          this.dataSourceSend.data.forEach(row => this.selection.select(row));

         // this.dataSource.paginator = this.paginator.toArray()[0];
          this.dataSource.sort = this.sort;
        
        },
        (error: HttpErrorResponse) => {

                });
         
        break;
      case 1:
        
        this._smsmailconfigService.getCommonAlertOrInputOptTelSmsConfigManyEquip(this.ListSelectedEquip,this.CustomerId)
        .subscribe((result) => {

         
          this.ListMails = [];
          this.ListMails = result["GetConfAlertSmsManyEquiResult"];
       
      
          this.ListMails.forEach(row=>{
            if(row.Send){
            this.selection.select(row);
            }
            row.DateDebut = new Date(svc2date(row.DateDebut));
            row.DateFin = new Date(svc2date(row.DateFin));
           })
          this.dataSource = new MatTableDataSource(this.ListMails);
          this.dataSourceSend = new MatTableDataSource(this.send);

          this.dataSourceSend.data.forEach(row => this.selection.select(row));

         // this.dataSource.paginator = this.paginator.toArray()[0];
          this.dataSource.sort = this.sort;
        
        },
        
        (error: HttpErrorResponse) => {
          
                });

        break;
    }
  }
  getFormattedDate(timestamp: string): string {
    const match = timestamp.match(/\d+/);
    if (match) {
      const milliseconds = parseInt(match[0], 10);
      const date = new Date(milliseconds);
      return date.toLocaleTimeString(); // Adjust this to format the date as you need
    }
    return '';
  }
  filterGroup(val: any) {
    this.lastFilter=val;
    if (typeof val == 'string' && val !=''){
   
       return this.listcargroup.filter(group=>({department:group.department,car:this._filter(group.car,val)}).car.length>0);
      
       
    }
    return this.listcargroup;
  
    
  }
  _filter(opt: any[], val: any) {
    if(val=='')
    {
      let carName = val.FullName || val;
     
      return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }
    else
    {
     let carName = val[0].FullName || val; 
    
  //  const filterValue = val.toLowerCase();
   return opt.filter(item => item.FullName.toLowerCase().indexOf(carName.toLowerCase()) >= 0);
    }
  
  } 
  toggleSelectAll()
  {
    this.isAllSelectedCar = !this.isAllSelectedCar;
    //this.selectedValue=null;
    let states=[];
    this.selectedValue.setValue(states);
    if(this.isAllSelectedCar)
    {
     
      this.listcargroup.forEach(group=>{
        group.car.forEach(row=>{
          states.push(row);
        })
        let checked = true;
        group.checked =true;
       // this.toggleParentAllSelect(checked,group)
        //group.checked=true;
       
      })
      this.selectedValue.setValue(states);
      this.listcargroup.forEach(group=>{
        this.isExpandCategory[group.department] =true;
      })
      this.selected();

    }
    else
    {
      this.listcargroup.forEach(group=>{
        group.checked =false;
        this.isExpandCategory[group.department] =false;
      })
    }

    this.stateRecord =  this.selectedValue.value;
   

  }
 
  toggleParent(event: any, group: any) {
   
    group.checked = event.checked;
   
    let states = this.selectedValue.value ;
    states = states ? states : [];
    if(event.checked) {
      group.car.forEach((x: any) => {
        states.push(x)
      })
    
    } else {
     
      group.car.forEach((x: any) => {
          if(states.indexOf(x) > -1) {
            states.splice(states.indexOf(x), 1)
          }
        });
    }
    this.selectedValue.setValue(states);
    if(event.checked) {
      this.selected();
    }
   /*   if(!event.checked) {
        this.form.get('keyTrackingObject').setValue( this.form.get('keyTrackingObject').value.filter((x:any) => !x.includes(group.car)))
      
    }*/
    this.stateRecord =  this.selectedValue.value;
    
  }
  displayVehicle(v: any) {
    
   if (Array.isArray(v)) {
    this.displayValue = '';
     v.forEach((v, index) => {
      if (index === 0) {
        this.displayValue = v.FullName + ' ';
      } else {
        this.displayValue += ', ' + v.FullName + ' ';
      }
    });
    return this.displayValue;
   } else {
    return this.displayValue;
   };
  }
 
  expandDocumentTypes(group: any) {
 
    this.isExpandCategory[group.department] = !this.isExpandCategory[group.department];
    // expand only selected parent dropdown category with that childs
  }
  toggleSelection2(event: any, name: any, group: any) {
    //console.log(group);
    //console.log(event.checked);
    
    if(event.checked) {
      
      this.stateRecord.push(name);
      this.selectedValue.setValue(this.stateRecord);
      this.isExpandCategory[group.department] =true;
      this.selected();
   
    }
    else {
        this.stateRecord = this.stateRecord.filter((x:any) => x!== name);
     
        this.selectedValue.setValue(this.selectedValue.value.filter((x:any) => x!== name));
       
        //this.states.setValue([]);
    }
  }
  toggleAllSelection22(event: any)
  {
    this.listcargroup.forEach(row=>{
      this.isExpandCategory[row.department]=true
    })
  }
  configure()
  { 
    

   // let test = this.ListMails;
   let listAllMails :any []=[];
   if(this.ListMails.length==0)
    this.ListMails=this.ListSms;
   this.ListMails.forEach(row=>{
    row.Send= false;
   

  });
 
   
    this.selection["_selected"].forEach(element => {
      this.ListMails.forEach(row=>{
        if(row.AlertType == element.AlertType)
        {
          row.Send=true;
        }
       // row.DateDebut='/Date(' + row.DateDebut.getTime() + ')/' ;
        //row.DateFin='/Date(' + row.DateFin.getTime() + ')/' ;
      });
    });
    
    if(this.id==0)
    {
      this.ListMails.forEach(row=>{
        if ( row.DateDebut.toString().indexOf("Date")<=-1) {
          row.DateDebut='/Date(' + row.DateDebut.getTime() + ')/' ;
        }
        if ( row.DateFin.toString().indexOf("Date")<=-1)
             row.DateFin='/Date(' + row.DateFin.getTime() + ')/' ;
      })
      this._smsmailconfigService.UpdateOrSaveMailCfgList(this.ListMails,this.ListSelectedEquip,this.CustomerId).subscribe((result) => {

        if(result["UpdateConfAlertMailSmsResult"] == true)
        {
          this._snackBar.open(this.data['NAV.configok'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right' ,
            duration  : 2000
             })
        }
        else{
          this._snackBar.open(this.data['NAV.configfail'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right' ,
            duration  : 2000
             })
        }
    },
    (err: HttpErrorResponse) => {
         //this.errorHandler.handleError(error);.handleError(err);
         this._snackBar.open(this.data['NAV.configfail'], 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right' ,
          duration  : 2000
           })
    });

    }
    else
    {
      this.ListMails.forEach(row=>{
        if ( row.DateDebut.toString().indexOf("Date")<=-1) {
          row.DateDebut='/Date(' + row.DateDebut.getTime() + ')/' ;
        }
        if ( row.DateFin.toString().indexOf("Date")<=-1)
             row.DateFin='/Date(' + row.DateFin.getTime() + ')/' ;
      })
      this._smsmailconfigService.UpdateOrSaveSmsCfgList(this.ListMails,this.ListSelectedEquip,this.CustomerId).subscribe((result) => {

        if(result["UpdateConfAlertSmsResult"] == true) 
        {
          this._snackBar.open(this.data['NAV.configok'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right' ,
            duration  : 2000
             })
        }
        else{
          this._snackBar.open(this.data['NAV.configfail'], 'OK', {
            // here specify the position
            verticalPosition: 'bottom',
            horizontalPosition: 'right' ,
            duration  : 2000
             })
        }
    },
    (err: HttpErrorResponse) => {
         //this.errorHandler.handleError(error);.handleError(err);
         this._snackBar.open(this.data['NAV.configfail'], 'OK', {
          // here specify the position
          verticalPosition: 'bottom',
          horizontalPosition: 'right' ,
          duration  : 2000
           })
    });

    }
   
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * New mail
   */

}
export interface CarGroup {
  department: string;
  car: any[];
  checked:boolean;
  
}
