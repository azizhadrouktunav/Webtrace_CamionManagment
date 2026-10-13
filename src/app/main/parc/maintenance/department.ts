import { FuseUtils } from '@fuse/utils';
import { isNullOrUndefined } from 'util';
export interface IDepartment {
    Id: number;
    Name: string;
    Customer: number;
    ExternalId: number;
    ExternalId2: number;
    ListIdTrackingObj: number[];
    ParentDep: number;
    Type: number;
    FullName?: any;
}
export interface IMCurrentCar {
    Matricule: string;
    Matricule2: string;
    FuelContainerCapacity: number;
    EmptyVoltage: number;
    FullVoltage: number;
    FuelEstimation: number;
    ADC_Use?: any;
    CarTypeEnum: number;
    ModelYear: number;
    DriverId: number;
    TankTypeEnum: number;
    TankModelEnum: number;
    Id: number;
    Icon: string;
    Department: IDepartment;
    ExternalId: number;
    ExternalId2: number;
    TrajectoryHexColor: string;
    Description: string;
    TrajectoryColor: number;
    VisitingCustomerParam: string;
}

export class IMaintenance {
    $id:                              string;
    m_CurrentCar:                     IMCurrentCar;
    Id:                               number;
    RecurringDateConfig:              number | null;
    MaintenanceType:                  number;
    Car:                              number;
    MileageIndex:                     null;
    MaintenanceDate:                  Date;
    MaintenanceFrequence:             number;
    WarnMeBeforeNDayKm:               number; 
    EnableGenerateAlertByWT:          boolean;
    EnableGenerateAlertByExternApp:   boolean;
    Customer:                         number;
    Changed:                          number;
    MaintenanceTypeEnum:              number;
    CurrentMileage:                   number;
    NextDueMileage:                   number;
    LastDueMileage:                   number;
    NextWarnedDueMileageForWT:        number;
    NextWarnedDueMileageForExternApp: number;
    MaintenanceDateLocal:             Date | null;
    RecurringMode:                    number;
    RecFrequencyNYearMonthWeekDay:    number;
    IsRecurringSun:                   boolean;
    IsRecurringMon:                   boolean;
    IsRecurringTue:                   boolean;
    IsRecurringWed:                   boolean;
    IsRecurringThu:                   boolean;
    IsRecurringFri:                   boolean;
    IsRecurringSat:                   boolean;
    ShowReminder:                     boolean;
    MaintenanceFrequenceString:       string; // Frequence
    WarnMeBeforeNDayKmString:         string; // Me Rappeler avant
    NextMaintenance:                  string; //prochain entretien
    MaintenanceTypeString:            string; //type
    NextExpiryDateLocalForExernApp:   Date | string;
    LastConfirmedAlertByWTLocal:      Date | string;
    BeginStartRecurringDateLocal:     Date | string;
    CurrentEngineHours:               number;
    IsReminderBy:                     number;
    IsReminderByEnum:                 number; // Date/KM/Heures
    EnabledDayOfWeekes:               number[];
    BeginStartRecurringDateGMT:       Date;
    //default constructor
    constructor(maintenance?){
        maintenance = maintenance || {};
        this.$id = maintenance.$id;
        this.m_CurrentCar =  maintenance.IMCurrentCar || null;
        this.Id =  maintenance.Id || null;
        this.RecurringDateConfig = maintenance.RecurringDateConfig || null;
        this.MaintenanceType = maintenance.MaintenanceType || null;
        this.Car =   maintenance.Car || null;
        this.MileageIndex = maintenance.MileageIndex || null;
        this.MaintenanceDate = !isNullOrUndefined(maintenance.MaintenanceDate) ? new Date(parseInt(maintenance.MaintenanceDate.substr(6))) :null;             
        this.MaintenanceFrequence = maintenance.MaintenanceFrequence || 0;  
        this.WarnMeBeforeNDayKm = maintenance.WarnMeBeforeNDayKm || null; 
        this.EnableGenerateAlertByWT =    maintenance.EnableGenerateAlertByWT || true;
        this.EnableGenerateAlertByExternApp =   maintenance.EnableGenerateAlertByExternApp || null;
        this.Customer = maintenance.Customer || null;      
        this.Changed = maintenance.Changed || null;           
        this.MaintenanceTypeEnum = maintenance.MaintenanceTypeEnum || null;
        this.CurrentMileage =   maintenance.CurrentMileage || 0;
        this.NextDueMileage = maintenance.NextDueMileage;
        this.LastDueMileage =   maintenance.LastDueMileage || 0;
        this.NextWarnedDueMileageForWT =   maintenance.NextWarnedDueMileageForWT || 0;
        this.NextWarnedDueMileageForExternApp =   maintenance.NextWarnedDueMileageForExternApp || 0;
        this.MaintenanceDateLocal = !isNullOrUndefined(maintenance.MaintenanceDateLocal) ? new Date(parseInt(maintenance.MaintenanceDateLocal.substr(6))) :null;
        this.RecurringMode = maintenance.RecurringMode || 4;
        this.RecFrequencyNYearMonthWeekDay = maintenance.RecFrequencyNYearMonthWeekDay || 1;
        this.IsRecurringSun = maintenance.IsRecurringSun || false;
        this.IsRecurringMon = maintenance.IsRecurringMon || false;
        this.IsRecurringTue = maintenance.IsRecurringTue || false;
        this.IsRecurringWed = maintenance. IsRecurringWed || false;
        this.IsRecurringThu = maintenance.IsRecurringThu || false;
        this.IsRecurringFri = maintenance.IsRecurringFri || false;
        this.IsRecurringSat = maintenance.IsRecurringSat || false;
        this.ShowReminder = maintenance.ShowReminder || false;              
        this.MaintenanceFrequenceString = maintenance.MaintenanceFrequenceString || ''; // Frequence
        this.WarnMeBeforeNDayKmString = maintenance.WarnMeBeforeNDayKmString || ''; // Me Rappeler avant
        this.NextMaintenance =  maintenance.NextMaintenance || ''; //prochain entretien
        this.MaintenanceTypeString = maintenance.MaintenanceTypeString || ''; // type
        this.NextExpiryDateLocalForExernApp = !isNullOrUndefined(maintenance.NextExpiryDateLocalForExernApp)? new Date(parseInt(maintenance.NextExpiryDateLocalForExernApp.substr(6))) :new Date();
        this.LastConfirmedAlertByWTLocal = !isNullOrUndefined(maintenance.LastConfirmedAlertByWTLocal)? new Date(parseInt(maintenance.LastConfirmedAlertByWTLocal.substr(6))) : new Date();
        this.BeginStartRecurringDateLocal = !isNullOrUndefined(maintenance.BeginStartRecurringDateLocal)? new Date(parseInt(maintenance.BeginStartRecurringDateLocal.substr(6))) : new Date();
        this.CurrentEngineHours = maintenance.CurrentEngineHours || 0;
        this.IsReminderBy =  maintenance.IsReminderBy;
        this.IsReminderByEnum =  maintenance.IsReminderByEnum || 1; // Date/KM/Heures
        this.EnabledDayOfWeekes = getDays(maintenance.IsRecurringSun,
            maintenance.IsRecurringMon,maintenance.IsRecurringTue,maintenance. IsRecurringWed,
            maintenance.IsRecurringThu,maintenance.IsRecurringFri,maintenance.IsRecurringSat);
        this.BeginStartRecurringDateGMT = !isNullOrUndefined(maintenance.NextMaintenance)?  new Date(parseInt(maintenance.NextMaintenance.substr(6))) : new Date();
    }
}
export function getDays(IsRecurringSun : boolean,IsRecurringMon: boolean,IsRecurringTue: boolean, 
    IsRecurringWed: boolean, IsRecurringThu: boolean, IsRecurringFri: boolean, IsRecurringSat: boolean):number[]{
    let  days:number[] = [];
     if(IsRecurringSun)
       days.push(0);
     if(IsRecurringMon)
        days.push(1);
     if(IsRecurringTue)
         days.push(2);
     if(IsRecurringWed)
         days.push(3);
     if(IsRecurringThu)
         days.push(4);
     if(IsRecurringFri)
         days.push(5);
     if(IsRecurringSat)
         days.push(6);

 return days;
 }
export enum WeekDay {
    Sunday,
    Monday ,
    Tuesday,
    Wednesday ,
    Thursday ,
    Friday ,
    Saturday
  }
  export enum WeekDaySaufWeeknd {
    Monday ,
    Tuesday,
    Wednesday ,
    Thursday ,
    Friday 
  }
export enum RecurringMode
    {
        Daily = 1,//evry n day (date of begin reminde)
        Weekly = 2, //evry n week in number of day(0 Sunday->7 Saturday)
        Monthly = 3,//evry n month in number of month(exp 01 of every 01 month)(date of begin reminde)
        Yearly = 4,//every n years(date of begin reminde)
        OneTime = 5//linked With ExpiriedDate
    }
export enum IsReminderBy
    {
        ByDate = 0,
        ByOdometer = 1,
        ByEngineHours = 2
    }
export enum MaintenanceTypeEnum
    {   
        SparkPlug = -30, 
        Chaindistributions = -31,
        BrakePads = -32,
        OilChange = -33,   
        Tire = -29,        
        AirConditionnerFilter = -58,      
        FuelFilter = -57,      
        AirFilter = -60,   
        OilFilter = -59,
    }
export const _MaintenanceTypeEnum: any[] = 
        [{id:-33 , name: 'OilChange'},
         {id:-32 , name: 'BrakePads'},
        {id:-31 , name: 'Chaindistributions'},  
        {id:-30, name: 'SparkPlug'},
        {id:-29 , name: 'Tire'},
        {id:-58 , name: 'AirConditionnerFilter'},
        {id:-57 , name: 'FuelFilter'},
        {id:-60 , name: 'AirFilter'},
        {id:-59 , name: 'OilFilter'}];
export class RepairMaintenanceLog {
        __type: string;
        Id: number;
        Car: number;
        MaintenanceType: number;
        DateCompletionGMT: Date;
        MileageCompletion: number; // Kilométrage d'achévement
        Cost: number; // cout
        InvoiceReference: string; // reference facture
        Supplier: string; //fournisseur
        Description: string;  // Description
        AccidentDetails?: number;
        PaidCost: number;
        MaintenanceReminder: number; // montant payé
        MaintenanceTypeStr: string; // type d'entretien
        DateCompletionLocal:  Date | null; // date d'achévenemnt
        Department: number;
        Driver: number;
        EngineHoursCompletion:number;
        PaidDateLocal: Date; // date de payement
        DateAvailableFromLocal: Date | null;
        DateAvailableToLocal:  Date | null;
        constructor(log?){
            log = log || {};
            this.Car = log.Car;
            this.Id = log.Id;
            this.MaintenanceType = log.MaintenanceType;
            this.DateCompletionGMT= log.DateCompletionGMT != undefined ? new Date(parseInt(log.DateCompletionGMT.substr(6))): new Date();
            this.MileageCompletion = log.MileageCompletion || 0;
            this.PaidCost = log.PaidCost || 0;
            this.Cost = log.Cost || 0;
            this.Department = log.Department || 0;
            this.PaidDateLocal = log.PaidDateLocal != undefined ? new Date(parseInt(log.PaidDateLocal.substr(6))): new Date();
            this.Driver = log.Driver || 0;
            this.MaintenanceReminder = log.MaintenanceReminder || '';
            this.AccidentDetails = log.AccidentDetails || '' ;
            this.MaintenanceTypeStr = log.MaintenanceTypeStr || '';
            this.InvoiceReference = log.InvoiceReference || '';
            this.Supplier = log.Supplier || '';
            this.MaintenanceReminder = log.MaintenanceReminder || '';
            this.DateCompletionLocal =  !isNullOrUndefined(log.DateCompletionLocal)?  new Date(parseInt(log.DateCompletionLocal.substr(6))): null;
            this.EngineHoursCompletion = log.EngineHoursCompletion || 0;
            this.DateAvailableFromLocal =  !isNullOrUndefined(log.DateAvailableFromLocal) ?  new Date(parseInt(log.DateAvailableFromLocal.substr(6))) : new Date();
            this.DateAvailableToLocal =  !isNullOrUndefined(log.DateAvailableFromLocal) ? new Date(parseInt(log.DateAvailableToLocal.substr(6))) : new Date();
            this.Description = log.Description || '';
        }  
             
}
export function parseJsonDate(jsonDateString){

    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
}
export function enumSelector(definition) {
    return Object.keys(definition).filter(key => !isNaN(definition[key])).map(key => {
        return {
            id: definition[key],
            name: key,
        };
    });
   }
export const maintenanceTypeEnum = enumSelector(MaintenanceTypeEnum);
export const isReminderBy = enumSelector(IsReminderBy);
export const recurringMode = enumSelector(RecurringMode);
export const days = enumSelector(WeekDay);
export const daysSaufWeeknd = enumSelector(WeekDaySaufWeeknd);

export interface TypeMaintenance {
    __type: string;
    Customer?: number;
    Id: number;
    Object: string;
    image?: any;
}
export interface _TypeMaintenance {
    d: TypeMaintenance
}
export function validateDates(sDate: Date, eDate: Date){
   var  isValidDate: Boolean = true;
     //Error Display
   var error:any={isError:false,errorMessage:''};
    if((sDate == null || eDate ==null)){
      error={isError:true,errorMessage:'Start date and end date are required.'};
      isValidDate = false;
    }
    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      error={isError:true,errorMessage:'End date should be grater then start date.'};
      isValidDate = false;
    }
    return isValidDate;
  }