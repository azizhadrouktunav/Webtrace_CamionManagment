import { Component, Inject, ViewEncapsulation, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IMaintenance, isReminderBy, recurringMode , _MaintenanceTypeEnum, days} from "../department";
import { MaintenanceService} from '../maintenance.service';
import * as _ from 'lodash';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { ThemePalette } from '@angular/material';
import { maintenanceTypeEnum } from '../department';
import { isEmpty } from 'rxjs/operators';
@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventFormComponent implements OnInit {
   
    IsReminderBy_:number = 1;
    MaintenanceTypeString:string;
    action: string;
    maintenance: IMaintenance;
    maintenanceForm: FormGroup;
    dialogTitle: string;
    maintenanceTypeEnum = maintenanceTypeEnum;
    recurringMode = recurringMode;
    isReminderBy;
    days = days;
    oneTime: boolean = true;
    showDays: boolean = false;
    typeDefault: any
    disabled: boolean = false;
    public showSpinners = true;
    public showSeconds = true;
    public color: ThemePalette = 'primary';
    public touchUi = false;
    car : any;
    HourOrKm : string = 'Km';
    @ViewChild('picker',{static: true}) picker: any;
    /**
     * Constructor
     *
     * @param {MatDialogRef<EventFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<EventFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _maintenanceService: MaintenanceService
  ) {
    
    this.isReminderBy = isReminderBy;
    this.action = _data.action;
    this.disabled = _data.disabled;

    if ( this.action === 'edit' )
    {   this.maintenance = _data.maintenance;
        this.showDays = this.maintenance.RecurringMode == 2 ? true : false;
        this.IsReminderBy_ = this.maintenance.IsReminderByEnum;
        this.dialogTitle = 'PARC.UpdateThisMaintenance'
    }
    else
    {   
        this.dialogTitle = 'PARC.AddMainteance';
        this.maintenance = new IMaintenance();
        this.car=_data.car
    }
    this.maintenanceForm = this.createEventForm();

   }

  ngOnInit() {
    if(this.action !== 'edit') {
      this._maintenanceService.EnumType.subscribe((data: number[])=> {

        this.maintenanceTypeEnum = this.maintenanceTypeEnum.filter(function(itm){
          return data.indexOf(itm.id) < 0;
        });
  
     });
     //this.maintenanceForm.get('MaintenanceTypeEnum').setValue(this.maintenance.MaintenanceType);

    }
    else {
      this.maintenanceForm.get('MaintenanceTypeEnum').disable();
    }
  }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createEventForm(): FormGroup
    {    
        return this._formBuilder.group({
          MaintenanceTypeEnum : new FormControl({value: this.maintenance.MaintenanceTypeEnum, disabled: (this.maintenanceTypeEnum.length === 0)}, Validators.required),
          IsReminderBy : new FormControl(this.maintenance.IsReminderByEnum),
          WarnMeBeforeNDayKm: new FormControl(this.maintenance.WarnMeBeforeNDayKm, Validators.required),
          Car: new FormControl(this.maintenance.Car),
          Id : new FormControl(this.maintenance.Id),
          BeginStartRecurringDateGMT  : new FormControl(this.maintenance.BeginStartRecurringDateLocal),
          Date: 
              new FormGroup({
                EnabledDayOfWeekes: new FormControl(this.maintenance.EnabledDayOfWeekes),
                RecurringMode: new FormControl(this.maintenance.RecurringMode),
                RecuringFrequencyNYearMonthWeekDay: new FormControl(this.maintenance.RecFrequencyNYearMonthWeekDay),
                }),
            Odometer:
                new FormGroup({
                  NextDueMileage: new FormControl(this.action == 'edit'? this.maintenance.NextDueMileage : this.car.MileageFloat  ,Validators.compose([Validators_.positiveNumberValidator(),Validators.min(this.action == 'edit'?this.maintenance.CurrentMileage: this.car.MileageFloat)]) ),
                  CurrentMileage: new FormControl({value:( this.action == 'edit'?this.maintenance.CurrentMileage:Math.round( this.car.MileageFloat)), disabled: true}),
                  //WarnMeBeforeNKM: new FormControl(this.maintenance.WarnMeBeforeNDayKm, ),
                  MaintenanceFrequence: new FormControl(this.maintenance.MaintenanceFrequence),
                }),
                 
        });
    }
    changed(e){
      this.IsReminderBy_ = e.value;

      if(e.value == 0) {
        this.HourOrKm = 'Days';
      }
      else if(e.value == 1){
        this.HourOrKm = 'Km';
      }
      else if(e.value == 2){
        this.HourOrKm = 'Hours';
      }
    }
    changedMode(e){
      this.showDays = e.value === 2 ? true : false;
      this.oneTime = e.value === 5 ? false : true;
    }
    changedDays(e){
        this.maintenance.EnabledDayOfWeekes = e.value;
    }
    updateValue()
    {
      /*let MaintenanceFrequence= this.maintenanceForm.get("Odometer").get("MaintenanceFrequence").value;
      let CurrentMileage= this.maintenanceForm.get("Odometer").get("CurrentMileage").value;
      this.maintenanceForm.get("Odometer").get("NextDueMileage").setValue( CurrentMileage+MaintenanceFrequence);*/
    }
  }
 
