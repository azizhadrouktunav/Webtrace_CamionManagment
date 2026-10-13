import { isNullOrUndefined } from 'util';

export class Driver {
    Address: string;
    BirthDateLocal?: Date;
    BirthPlace: string;
    CIN: string;
    CardCouponReminderJSON?: any;
    CardCouponReminderJSONToDo?: any;
    CurrentTransportationId?: any;
    CurrentTransportationName: string;
    DepartmentFullString?: any;
    DepartmentId: number;
    DepartmentString: string;
    DriverCode: string;
    DriverCodeInt: number;
    DriverLicenseExpirationDateLocal?: Date;
    DriverLicenseNumber: string;
    DriverLicenseType: string;
    DriverStatus: string;
    Email: string;
    ExistCardCouponReminderForThisDriver: boolean;
    FirstName: string;
    FullName: string;
    IdCardCouponLogJSON?: IdCardCouponLogJSON[];
    IsFree: boolean;
    LastName: string;
    Tel: string;
    UrlScannedCINBack: string;
    UrlScannedCINFront: string;
    UrlScannedDriverLicenseBack: string;
    UrlScannedDriverLicenseFront: string;
    key: number;
    ElockSealCardId : string;
    ElockUnsealCardId : string;
    EquipElemAccessToDriverCode:any;

    constructor(data?){
        data = data || {};
        this.Address = data.Address || ''; // form
        this.BirthDateLocal = !isNullOrUndefined(data.BirthDateLocal)? new Date(parseInt(data.BirthDateLocal.substr(6))) : null; // form
        this.BirthPlace = data.BirthPlace || ''; // form
        this.CIN = data.CIN || ''; // form
        this.CardCouponReminderJSON = data.CardCouponReminderJSON;
        this.CardCouponReminderJSONToDo = data.CardCouponReminderJSONToDo;
        this.CurrentTransportationId = data.CurrentTransportationId;
        this.CurrentTransportationName = data.CurrentTransportationName;
        this.DepartmentFullString = data.DepartmentFullString;
        this.DepartmentId =  !isNullOrUndefined(data.DepartmentId) ? data.DepartmentId : !isNullOrUndefined(data.Department) ? data.Department.Id : null;
        this.DepartmentString = !isNullOrUndefined(data.DepartmentString) ? data.DepartmentString : !isNullOrUndefined(data.Department) ? data.Department.FullName : '';
        this.DriverCode = data.DriverCode || '';
        this.ElockSealCardId = data.ElockSealCardId || '';
        this.ElockUnsealCardId = data.ElockUnsealCardId || '';

        this.DriverCodeInt = data.DriverCodeInt;
        this.DriverLicenseExpirationDateLocal = !isNullOrUndefined(data.DriverLicenseExpirationDateLocal) ? new Date(parseInt(data.DriverLicenseExpirationDateLocal.substr(6))) : new Date();
        this.DriverLicenseNumber = data.DriverLicenseNumber || 0; // form
        this.DriverLicenseType = data.DriverLicenseType || ''; // form
        this.DriverStatus = data.DriverStatus;
        this.Email = data.Email || ''; // form Email
        this.ExistCardCouponReminderForThisDriver = data.ExistCardCouponReminderForThisDriver;
        this.FirstName = data.FirstName || ''; // form
        this.FullName = data.FullName || ''; // form
        this.IdCardCouponLogJSON = data.IdCardCouponLogJSON;
        this.IsFree = data.IsFree;
        this.LastName = data.LastName || ''; // form
        this.Tel = !isNullOrUndefined(data.Tel) ? data.Tel : data.MobileTelephoneNumber || ''; // form
        this.UrlScannedCINBack = data.UrlScannedCINBack;
        this.UrlScannedCINFront = data.UrlScannedCINFront;
        this.UrlScannedDriverLicenseBack = data.UrlScannedDriverLicenseBack;
        this.UrlScannedDriverLicenseFront = data.UrlScannedDriverLicenseFront;
        this.key = !isNullOrUndefined(data.key) ? data.key : data.Id; // form
        this.EquipElemAccessToDriverCode=data.EquipElemAccessToDriverCode;
    }
}
export interface IdCardCouponLogJSON {
    Key: number;
    Value: Value;
}
export interface Value {
    Car: number;
    CardCoupon: number;
    Description: string;
    Driver: number;
    ForMissionEndDateLocal: Date;
    ForMissionStartDateLocal: Date;
    Id: number;
    PricePerL: number;
    QuantityL: number;
    TotalPrice: number;
}