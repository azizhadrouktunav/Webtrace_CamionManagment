import { isNullOrUndefined } from 'util';
export function GetRecurringModeString(freq: number,mode:number):String{
    switch (mode) {
        case 1:
        return 'Chaque ' +freq+' jour(s)';
        break;
        case 2 :
        return 'Chaque ' +freq+' semaine';
        break;
        case 3:
        return 'Chaque ' +freq+' mois';
        break;
        case 4 :
        return 'Chaque ' +freq+ ' année';
        break;
        case 5 :
        return ' à cette date';
        break;
        }}  
export const documentTypes: any[] = 
[{id:1 , name: 'Roadtax'},
{id:2 , name: 'Insurrance'},
{id:3 , name: 'Vehicleinspection'},
{id:-1 , name: 'Othertax'}];
               
                export function getdocumentTypeString(item:number):String{
                    switch (item) {
                         case 0 :
                        return 'Autre taxe';
                         break;
                        case 1 :
                        return 'Vignette';
                        break;
                        case 2:
                        return 'Assurance';
                        break;
                        case 3 :
                        return 'Contrôle technique (visite)';
                        break;
                        case -1 :
                        return 'Autre taxe';
                        break;
                        }}
                
                export function getIcon(item: number): string{
                            switch (item) {
                                case 0:
                                return 'tax';
                                break;
                                case 1 :
                                return 'vignette.png';
                                break;
                                case 2:
                                return 'insurrance.png';
                                break;
                                case 3 :
                                return 'control.png';
                                break;
                                case -1 :
                                return 'tax.png';
                                break;
                                }}   
export class Document {
    __type: string;
    RecurringMode: number;
    RecFrequencyNYearMonthWeekDay: number;
    BeginStartRecurringDateGMT: Date;
    IsRecurringSun: boolean;
    IsRecurringMon: boolean;
    IsRecurringTue: boolean;
    IsRecurringWed: boolean;
    IsRecurringThu: boolean;
    IsRecurringFri: boolean;
    IsRecurringSat: boolean;
    Id: number;
    Car: number;
    DocumentType: number;
    LastDueDateGMT?: any;
    ActivationCost?: any;
    RecurringCost?: any;
    ExpenditureType?: any;
    RecurringDateConfig: number;
    Changed: number;
    WarnMeBeforeNDay: number;
    EnableGenerateAlertByWT: boolean;
    EnableGenerateAlertByExternApp: boolean;
    LastConfirmedAlertByWTGMT: Date;
    LastGenerateAlertByExternAppGMT?: any;
    Customer: number;
    ExpiryDateGMTForWT: Date;
    ExpiryDateGMTForExernApp: Date;
    ChangedByTrackingSystemEnum: number;
    ShowReminder: boolean;
    ShowReminderForExternApp: boolean;
    DocumentTypeEnum: number;
    DocumentTypeString: string;
    WarnMeBeforeNDayKm: number;
    CarDocumentReminderFrequenceString: string;
    WarnMeBeforeNDayKmString: string;
    NextCarDocumentReminder: Date;
    BeginStartRecurringDateLocal: Date;
    ExpiryDateLocalForWT: Date;
    CustomerId: number;
    IsEventAddedFaoSavingAlert: boolean;
    Department?: any;
    Driver?: any;
    EnabledDayOfWeekes?: number[];
    constructor(data?) {
        data = data || {};
        this.RecurringMode = data.RecurringMode || 1;
        this.RecFrequencyNYearMonthWeekDay = data.RecFrequencyNYearMonthWeekDay || 1 ;
        this.IsRecurringSun = data.IsRecurringSun || false; 
        this.IsRecurringMon = data.IsRecurringMon || false;
        this.IsRecurringTue = data.IsRecurringTue || false;
        this.IsRecurringWed = data.IsRecurringWed || false;
        this.IsRecurringThu = data.IsRecurringThu || false;
        this.IsRecurringFri = data.IsRecurringFri || false;
        this.IsRecurringSat = data.IsRecurringSat || false;
        this.EnabledDayOfWeekes = [];
        this.Id = data.Id || -1;
        this.Car = data.Car || -1;
        this.DocumentType = data.DocumentType || -1;
        this.RecurringDateConfig = data.RecurringDateConfig || 1;
        this.WarnMeBeforeNDay = data.WarnMeBeforeNDay || 1;
        this.Customer = data.Customer || -1 ;
        this.ExpiryDateGMTForWT = !isNullOrUndefined(data.ExpiryDateGMTForWT)? new Date(parseInt(data.ExpiryDateGMTForWT.substr(6)))  : new Date();
        this.ShowReminder = data.ShowReminder || false;
        this.DocumentTypeEnum = data.DocumentTypeEnum || 1;
        this.DocumentTypeString = data.DocumentTypeString || '';
        this.WarnMeBeforeNDayKm = data.WarnMeBeforeNDayKm || 1;
        this.CarDocumentReminderFrequenceString = data.CarDocumentReminderFrequenceString || ''  
        this.WarnMeBeforeNDayKmString = data.WarnMeBeforeNDayKmString ||   data.WarnMeBeforeNDay +' jour(s)' ;
        this.NextCarDocumentReminder = data.NextCarDocumentReminder || '';
        this.BeginStartRecurringDateLocal = !isNullOrUndefined(data.BeginStartRecurringDateLocal)? new Date(parseInt(data.BeginStartRecurringDateLocal.substr(6)))  : new Date();
        this.BeginStartRecurringDateGMT = !isNullOrUndefined(data.BeginStartRecurringDateGMT)? new Date(parseInt(data.BeginStartRecurringDateGMT.substr(6)))  : new Date();
    }
}
export class DocumentLogModel {

    Id: number;
    Car: number;
    DocumentType: number;
    DateAvailableFromGMT: Date;
    DateAvailableToGMT: Date;
    PaidDateGMT: Date;
    Cost: number;
    PaidCost: number;
    Customer: number;
    CarDocumentReminder: number;
    InvoiceReference: string;
    Supplier: string;
    Description: string;
    DateAvailableFromToLocalDateTime: Date;
    DateAvailableToToLocalDateTime: Date;
    PaidDateLocal: Date;
    DocumentTypeStr: string;
    Department?: null;
    Driver?: null;

     constructor(d?: any) {
         d= d || {};
        this.Id = d.Id || -1;
        this.Car = d.Car || '';
        this.DocumentType = d.DocumentType || '';
        this.DateAvailableFromGMT = !isNullOrUndefined(d.DateAvailableFromGMT)? new Date(parseInt(d.DateAvailableFromGMT.substr(6))) : new Date();
        this.DateAvailableToGMT =  !isNullOrUndefined(d.DateAvailableToGMT)? new Date(parseInt(d.DateAvailableToGMT.substr(6))) : new Date();
        this.PaidDateGMT =  !isNullOrUndefined(d.PaidDateLocal)? new Date(parseInt(d.PaidDateLocal.substr(6))) : new Date();
        this.Cost = d.Cost  || 0;
        this.PaidCost = d.PaidCost  || 0;
        this.Customer = d.Customer  || '';
        this.CarDocumentReminder = d.CarDocumentReminder  || '';
        this.InvoiceReference = d.InvoiceReference  || '';
        this.Supplier = d.Supplier  || '';
        this.Description = d.Description  || '';
        this.DateAvailableFromToLocalDateTime = d.DateAvailableFromToLocalDateTime  || '';
        this.DateAvailableToToLocalDateTime = d.DateAvailableToToLocalDateTime  || '';
        this.PaidDateLocal = !isNullOrUndefined(d.PaidDateLocal)? new Date(parseInt(d.PaidDateLocal.substr(6))) : new Date();
        this.DocumentTypeStr = d.DocumentTypeStr  || '';
        this.Department = d.Department  || '';
        this.Driver = d.Driver  || '';
      }
  }
       
                
                
                
                
              