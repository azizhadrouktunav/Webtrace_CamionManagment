import { PlanningModel } from './planning';
import { isNullOrUndefined } from 'util';

export class BorrowedModel {

    public static DriverList: any = [];
    public static calender: PlanningModel [] =[];

    ActivationCost: number;
    BeginStartRecurringDateGMT: string;
    Car: number;
    CarInDateGMT: string;
    CarOutDateGMT: string;
    Changed: number;
    ContractEndDateGMT: Date;
    ContractRef: string;
    ContractStartDateGMT: Date;
    ContractType: number;
    ContractTypeString: string;
    Cost: number;
    Customer: number;
    EnableAlertEndRenewContractConfirmedByWT: boolean;
    EnableAlertForEndRenewContractByApp: boolean;
    EnableGenerateAlertPayementExpiredByExternApp: boolean;
    EnableGenerateAlertPaymentExpiredByWT: boolean;
    EndRenewedDateGMT?: null;
    ExpiryDatePaymentGMTForExernApp?: null;
    ExpiryDatePaymentGMTForWT: string;
    FirstDriver: number;
    GazFuelLevelPercent: number;
    Id: number;
    LastConfirmedAlertPayementByWTGMT?: null;
    LastGeneratedAlertEndRenewConfirmedByWT?: null;
    LastGenratedAlertEndRenewContractByApp?: null;
    OdometerInKm: number;
    OdometerOutKm: number;
    RecurringCost: number;
    RecurringDateConfig: number;
    SecondDriver: number;
    WarnMeBeforeNDay: number;
    ContractEndDate: Date;
    ContractStartDate: Date;
    FirstDriverString: string;
    SecondDriverString: string;
    PaidCostFrequenceString: String;
    ShowReminder: boolean;
    ShowExpiredContract :  boolean;
   constructor(d: any) {
    this.ActivationCost = d.ActivationCost || '';
    this.BeginStartRecurringDateGMT = d.BeginStartRecurringDateGMT || '';
    this.Car = d.Car || '';
    this.CarInDateGMT = d.CarInDateGMT || '' ;
    this.CarOutDateGMT = d.CarOutDateGMT || '';
    this.Changed = d.Changed || '';
    this.ContractEndDateGMT = d.ContractEndDateGMT || '';
    this.ContractRef = d.ContractRef || '';
    this.ContractStartDateGMT = d.ContractStartDateGMT || '';
    this.ContractType = d.ContractType || '';
    this.ContractTypeString = getContractTypeString(d.ContractType) || '';
    this.Cost = d.Cost || '';
    this.Customer = d.Customer || '';
    this.EnableAlertEndRenewContractConfirmedByWT = d.EnableAlertEndRenewContractConfirmedByWT || '';
    this.EnableAlertForEndRenewContractByApp = d.EnableAlertForEndRenewContractByApp || '';
    this.EnableGenerateAlertPayementExpiredByExternApp = d.EnableGenerateAlertPayementExpiredByExternApp || '';
    this.EnableGenerateAlertPaymentExpiredByWT = d.EnableGenerateAlertPaymentExpiredByWT || '';
    this.EndRenewedDateGMT = d.EndRenewedDateGMT || '';
    this.ExpiryDatePaymentGMTForExernApp = d.ExpiryDatePaymentGMTForExernApp || '';
    this.ExpiryDatePaymentGMTForWT = d.ExpiryDatePaymentGMTForWT || '';
    this.FirstDriver = d.FirstDriver || '';
    this.GazFuelLevelPercent = d.GazFuelLevelPercent || '';
    this.Id = d.Id;
    this.LastConfirmedAlertPayementByWTGMT = d.LastConfirmedAlertPayementByWTGMT || '';
    this.LastGeneratedAlertEndRenewConfirmedByWT = d.LastGeneratedAlertEndRenewConfirmedByWT || '';
    this.LastGenratedAlertEndRenewContractByApp = d.LastGenratedAlertEndRenewContractByApp || '';
    this.OdometerInKm = d.OdometerInKm || '';
    this.OdometerOutKm = d.OdometerOutKm || '';
    this.RecurringCost = d.RecurringCost;
    this.RecurringDateConfig = d.RecurringDateConfig || '';
    this.SecondDriver = d.SecondDriver || '';
    this.WarnMeBeforeNDay = d.WarnMeBeforeNDay || '';
    this.ContractEndDate =  !isNullOrUndefined(d.ContractEndDateGMT) ? new Date(parseInt(d.ContractEndDateGMT.substr(6))) :null;
    this.ContractStartDate = !isNullOrUndefined(d.ContractEndDateGMT) ? new Date(parseInt(d.ContractStartDateGMT.substr(6))) :null;
    this.FirstDriverString = getDriverString(d.FirstDriver);
    this.SecondDriverString = getDriverString(d.SecondDriver);
    this.PaidCostFrequenceString = GetRecurringCostString(d.RecurringCost, +d.RecurringDateConfig-16)
    this.ShowReminder = d.ShowReminder || false;
    this.ShowExpiredContract = d.ShowExpiredContract || false;
  }
}
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
        
export function GetRecurringCostString(cost: number,mode:number):String{ 
   
    switch (mode) {
        case 1:
        return 'Payment de ' +cost+' D chaque jour(s)';
        break;
        case 2 :
        return 'Payment de ' +cost+' D chaque semaine';
        break;
        case 3:
        return 'Payment de ' +cost+' D chaque mois';
        break;
        case 4 :
        return 'Payment de ' +cost+ ' D chaque année';
        break;
        case 5 :
        return 'Payment de ' +cost+' D à cette date';
        break;
        }}  
        

        export function getDriverString(i)
        {  if (i != undefined)
          {let driver = BorrowedModel.DriverList.find(x =>  x.key == i);
             if(driver != undefined)
             {
              return driver.FullName ;
             }
             else

             {
              return "" ;
             }
          
        }
          else {
          return '';
          }
        }

        export enum ContractTypeEnum
        {
             //[Description("Loué")]
                Rental = 1,
               //[Description("Emprunté")]
                 Borrowed = 2,
        }
     export function getContractTypeString(item: number): string{
         switch (item) {
           
             case 1 :
             return 'Loué';
             break;
             case 2:
             return 'Emprunté';
             break;
             
             }}
     