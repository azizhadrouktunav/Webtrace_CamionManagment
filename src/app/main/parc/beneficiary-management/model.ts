//import { AccessRightsOfCurrentAccount } from '../order-management/model';
import { ListAccount, ListTracking, ListDriver, ListDepartment } from '../interfaces/depenses-general';
import { IDepartment } from '../maintenance/department';
import { isNullOrUndefined } from 'util';
import * as _ from 'lodash';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';

//GetBenefManagementParam
export interface BenefManagementParam {
    ListAccount: ListAccount[];
    CustomerBenef: CustomerBenef;
    ListTracking: ListTracking[];
    ListDriver: ListDriver[];
    ListDepartment: ListDepartment;
    AccessRightsOfCurrentAccount: any;
    Account: any
}
export class Beneficiary {
    ID: any;
    Adresse: any;
    Customer: any;
    Email: any;
    Telephone: any;
    Web: any;
    IsDeleted: any;
    FirstName: any;
    SaveDate: Date;
    IdCustomer: any;
   
    // constructor
    constructor(beneficiary?){
        beneficiary = beneficiary || {};
        this.ID = beneficiary.ID || 0;
        this.Adresse = beneficiary.Adresse
        this.Customer = beneficiary.Customer
        this.Email = beneficiary.Email
        this.Telephone = beneficiary.Telephone
        this.Web = beneficiary.Web
        this.IsDeleted = !_.isEmpty(beneficiary) ? beneficiary.IsDeleted : false
       
        this.FirstName = beneficiary.FirstName
        this.IdCustomer = !isNullOrUndefined( beneficiary.Customer)?  beneficiary.Customer.Id : null
        this.SaveDate =  !isNullOrUndefined(beneficiary.SaveDate)? new Date(parseInt(beneficiary.SaveDate.substr(6))) : new Date();
    }
}
export interface CustomerBenef {
    m_Config: number;
    Id: number; // Id
    Name: string;
    Email1?: any;
    Email2?: any;
    Email3?: any;
    Tel1?: any;
    Tel2?: any;
    Tel3?: any;
    Website?: any;
    Adress?: any;
    CustomerStatus: number;
    CustomerType: number;
    SubscriptionDate: Date;
    CarCount: number;
    AccountsCount: number;
    ExpirationDateForTnvGMT: Date;
    IsReseller: boolean;
    DownloadPassword?: any;
    CustomerStatusEnum: number;
    Reseller: number;
    IsGeocodingFromSTDPlaceAndPlace: boolean;
    IsGeocodingFromTunavSvcAndPlace: boolean;
    IsGeocodingFromOSMSvcAndPlace: boolean;
    SiteName: string;
    Config: number;
    SmsForAllCar: boolean;
    MailForAllCar: boolean;
    MessageToShow?: any;
    URL?: any;
    CanAddCars: boolean;
    IsTunavAdmin: boolean;
    ConditionalSpeedForcedArmKmh: number;
    TimeOutToSendCommandMn: number;
    AuthorizedSMSCount: number;
    AuthorizedSMSCountString: string;
    NbrAuthorizedSMSBySingleNumber: number;
    SubcriptionWebAccountStatusEnumForTunav: number;
    IsGeocodingFromGoogleSvcAndPlace: boolean;
    LastConnectionInfo: string;
    LastConnectionDateGMT: Date;
    GMT: number;
    ExpirationDateForResellerGMT: Date;
    SubcriptionWebAccountStatusEnumForReseller: number;
    ExpirationDateStatusEnumValueForTunav: number;
    LastConnectionStatusEnumValue: number;
    IsAuthorizedSMSEnable: boolean;
    MarketingFormulaContractValue: number;
    MarketingFormulaContractValueString: string;
    ExpirationDateStatusEnumValueForReseller: number;
    AutoLockCtmByTnvInDay: number;
    AutoLockCtmByResInDay: number;
    CustomerLockedStateEnum: number;
    IsLocked: boolean;
    LastLockedCtmByTnvState: boolean;
    LastLockedCtmByResState: boolean;
    SendMailToTnvWhenAutoCtmLockedByTnv: boolean;
    SendMailToTnvWhenAutoCtmLockedByRes: boolean;
    SendMailToTnvWhenAutoCtmUnlockedByTnv: boolean;
    SendMailToTnvWhenAutoCtmUnlockedByRes: boolean;
    SendMailToTnvWhenAutoCtmLockedIgnoredByTnv: boolean;
    SendSMSToTnvWhenAutoCtmLockedByTnv: boolean;
    SendSMSToTnvWhenAutoCtmLockedByRes: boolean;
    SendSMSToTnvWhenAutoCtmUnlockedByTnv: boolean;
    SendSMSToTnvWhenAutoCtmUnlockedByRes: boolean;
    SendSMSToTnvWhenAutoCtmLockedIgnoredByTnv: boolean;
    SendMailToResWhenAutoCtmLocked: boolean;
    SendSMSToResWhenAutoCtmLocked: boolean;
    SendMailToResWhenAutoMsg4PaymentInvoiceShowed: boolean;
    SendSMSToResWhenAutoMsg4PaymentInvoiceShowed: boolean;
    SendMailToTnvWhenAutoMsg4PaymentInvoiceShowed: boolean;
    SendSMSToTnvWhenAutoMsg4PaymentInvoiceShowed: boolean;
    SendMailToCtmWhenAutoMsg4PaymentInvoiceShowed: boolean;
    SendSMSToCtmWhenAutoMsg4PaymentInvoiceShowed: boolean;
    LastAutoMsg4PaymentInvoiceShowedByTnvState: boolean;
    LastAutoMsg4PaymentInvoiceShowedByResState: boolean;
    AutoLockCtmByResInDayStatusEnumValue: number;
    AutoLockCtmByTnvInDayStatusEnumValue: number;
    AutoShowMsg4PaymentInvoiceByTnvInDay: number;
    AutoShowMsg4PaymentInvoiceByResInDay: number;
    AutoShowMsg4PaymentInvoiceStatusEnumByResValue: number;
    AutoShowMsg4PaymentInvoiceStatusEnumByTnvValue: number;
    LastLockedManuallyCtmByTnvState: boolean;
    NbrEq: number;
    NbrEqDisconnectedMoreThanXTime: number;
    NbrEqConnectedFromXTime: number;
    LastLockedManuallyCtmByResState: boolean;
    IsAuthorizedToUseTunavMaps: boolean;
    IsAuthorizedToUseGooglePlanMaps: boolean;
    IsAuthorizedToUseGoogleSatelliteMaps: boolean;
    IsAuthorizedToUseHereMaps: boolean;
    IsAuthorizedToUseOSMMaps: boolean;
    IsEnableLoadDelegation: boolean;
    UseCustomGrpSMSModem: boolean;
}

