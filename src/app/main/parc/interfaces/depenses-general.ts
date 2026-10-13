import { Data } from '@angular/router';

export interface DepensesGeneral {
}
export interface GeneralCost {
    ListAccount: ListAccount[];
    //CustomerBenef: CustomerBenef;
    ListTracking: ListTracking[];
    ListDriver: ListDriver[];
    ListDepartment: ListDepartment[];
    ListSupplier: ListSupplier[];
    ListCategory: ListCategory[];
    ListModel: ListModel[];
  //  AccessRightsOfCurrentAccount: AccessRightsOfCurrentAccount;
   // Account: Account;
}
export interface ListTracking {
    CurrentDriverElement: [];
    FullName: string;
    Key: number;
    CurrentEquipmentSerialNumber: string;
    AcquisitionTimeLocal: Date;
}
export interface ListModel {
    Category: Category;
    ID: number;
    NameModel: string;
    Customer_ID?: any;
}
export interface ListCategory {
    ID: number;
    NameCategory: string;
    Customer_ID?: any;
}

export interface Category {
    ID: number;
    NameCategory: string;
    Customer_ID?: any;
}
export interface ListSupplier {
    ID: number;
    Name: string;
    SaveDate: Date;
    Type: number;
    TypeStr: string;
    IsConstructer: boolean;
    IsConstructerStr: string;
    Description: string;
    Address: string;
    Phone: string;
    Mail: string;
    Responsible1Name: string;
    Responsible2Name: string;
    WebSite: string;
    IsDeleted: boolean;
    MaxBudget: number;
    Customer_ID: number;
}
export interface ListDepartment {
    Id: number;
    Name: string;
    Customer: number;
    ExternalId: number;
    ExternalId2: number;
    ListIdTrackingObj?: any;
    ParentDep: number;
    Type: number;
    FullName?: any;
}
export interface ListDriver {
    FirstName: string;
    LastName: string;
    Email: string;
    Tel: string;
    key: number;
    FullName: string;
    CurrentTransportationName: string;
    IsFree: boolean;
    DriverStatus: string;
    DriverCode: string;
    DriverCodeInt: number;
    DepartmentString: string;
    DepartmentFullString?: any;
    ExistCardCouponReminderForThisDriver: boolean;
    CardCouponReminderJSONToDo?: any;
    CardCouponReminderJSON?: any;
    IdCardCouponLogJSON?: any;
    CurrentTransportationId?: number;
    DepartmentId: number;
    Address: string;
    BirthDateLocal?: Date;
    BirthPlace: string;
    CIN: string;
    DriverLicenseType: string;
    DriverLicenseNumber: string;
    DriverLicenseExpirationDateLocal?: Date;
    UrlScannedCINFront: string;
    UrlScannedCINBack: string;
    UrlScannedDriverLicenseFront: string;
    UrlScannedDriverLicenseBack: string;
}
export interface ListAccount {
    //m_account: MAccount;
    //m_customer: MCustomer;
    //m_hashPageAccess: MHashPageAccess;
    //m_hashAccountDepartments: MHashAccountDepartments;
    //hashPageAccesible: HashPageAccesible;
    //Customer: Customer2;
    Login: string;
    ViewAllTrackingObjects: boolean;
    ControlledDepartment: string;
    Id: number;
    IsTunavAdmin: boolean;
    //AccessDepartment: AccessDepartment[];
    IsCanUpdateCarCount: boolean;
    IsReseller: boolean;
    RoleAccountEnumString: string;
    CanAddCustomer: boolean;
    CanUpdateExpirationDate: boolean;
    CanConfigSendingMailAndSMS: boolean;
    CanUpdateTelephone: boolean;
    CanUpdateMail: boolean;
    CanUpdateMarketingFormulaContract: boolean;
    CanUpdateGeocoding: boolean;
    CanUpdateForcedArming: boolean;
    CanUpdateAutoLockCtmByTnvInDay: boolean;
    CanUpdateAutoShowMsg4PaymentInvoiceByTnvInDay: boolean;
    CanSetWebConfigParam: boolean;
    CanEnableToUseTwoDataBase: boolean;
    CanAddOrUpdateTelNumber: boolean;
    CanDeleteTelNumber: boolean;
    CanUpdateNbrAuthorizedSMSBySingleNbr: boolean;
    CanGetCustomer: boolean;
    CanUpdateReseller: boolean;
    CanUpdateAuthorizedMaps: boolean;
    CanUpdateLoadDelegation: boolean;
    CanManageEquipmentPassword: boolean;
    CanAccessedToAccManagAdmin: boolean;
    CanManageEquipment: boolean;
    ResellerJok: number;
    FirstName: string;
    LastName: string;
    IsCanUpdateAccountsCount: boolean;
    ReselerApp: number;
    CanAddCar: boolean;
    AdminAcc: number;
}
export interface ListTypeSelected {
    ID: number;
    Name?: string;
    MaxBudget?: any;
    TotalCost?: number;
    ListDetailsCost ?: ListDetailsCost[];
}
export interface ListCostAndDetails {
    ListCost: ListTypeSelected[];
    ListDetailsCost: ListDetailsCost[];
    ListDetailsCostRepairMaintenanceLog: ListDetailsCostRepairMaintenanceLog[];
    ListDetailsCostCarDocumentLog: ListDetailsCostCarDocumentLog[];
    ListDetailsCostCardCouponLog: any[];
}
export interface ListDetailsCostRepairMaintenanceLog {
    Id: number;
    Car: number;
    MaintenanceType: number;
    DateCompletionGMT: Date;
    MileageCompletion: number;
    Cost: number;
    InvoiceReference: string;
    Supplier: string;
    Description: string;
    AccidentDetails?: any;
    PaidCost: number;
    MaintenanceReminder: number;
    MaintenanceTypeStr: string;
    DateCompletionLocal: Date;
    Department: number;
    Driver: number;
    PaidDateLocal: Date;
}
export interface ListDetailsCostCarDocumentLog {
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
    PaidDateLocal: Date;
    DocumentTypeStr: string;
    Department?: any;
    Driver?: any;
}
export interface ListDetailsCost {
    Quantity: number;
    ActionDate: Date;
    Reference: string;
    PUHT: number;
    PUTTC: number;
    TotalCost: number;
    car: number;
    carLib?: string;
    Supplier?:Supplier;
    Beneficiary?:Beneficiary;
    CategoryID?:number;
    ModelID?:number;
    BenefAcc?:number;
    BenefDep?:number;
    BenefDri?:number;
    QuantityString?:string;
    
}
export interface Supplier
{
    ID : number;
    Name:string;
}
export interface Beneficiary
{
    ID : number;
    Name:string;
}
export interface DataChart {
    name: string;
    value: number;
    label?: string;
}
export interface DataChart2 {
    name: Date;
    value: number;
    label?: string;
}
export interface DataLine {
    name: string;
    series: DataChart2 [];
}


