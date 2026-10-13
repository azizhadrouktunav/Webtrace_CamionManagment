export interface gestion_de_stock {
    BarCode: String;
    Category: any;
    Customer: any;
    Department: any;
    Dimension: any;
    ID: any;
    IsDeleted: any;
    Model: any;
    Name: any;
    NumSerie: any;
    Reference: any;
    RemainingQuantities: any;
    State: any;
    StateStr: any;
    StorageDate: any;
    StoragePlace: any;
    Supplier: any;
    TVAInPercents: any;
    TotalQuantity: any;
    UnitPurchasePriceHT: any;
    UnitPurchasePriceTTC: any;
    UnitSellingPriceHT: any;
    UnitSellingPriceTTC: any;
  }
export interface stockParam{
  CustomerProduct: any,
  ListBeneficiary: any,
  ListBills: any,
  ListCategory: any,
  ListDeliveryForm: any,
  ListDepartment: any,
  ListModel: any,
  ListOrderForm: any,
  ListSupplier: any
} 
export interface categoryModel{
  Customer_ID: any,
  ID: any,
  NameCategory: any
} 
export interface ModelModel{
  Category: any,
  Customer_ID: any,
  ID: any,
  NameModel: any
}
export interface deptModel{
  Customer: any,
  ExternalId: any,
  ExternalId2: any,
  FullName: any,
  Id: any,
  ListIdTrackingObj: any,
  Name: any,
  ParentDep: any,
  Type: any
} 
export interface fornisseursModel{
  Address: any,
  Customer_ID: any,
  Description: any,
  ID: any,
  IsConstructer: any,
  IsConstructerStr: any,
  IsDeleted: any,
  Mail: any,
  MaxBudget: any,
  Name: any,
  Phone: any,
  Responsible1Name: any,
  Responsible2Name: any,
  SaveDate: any,
  Type: any,
  TypeStr: any,
  WebSite: any,
} 
export interface CustomerProductModel{
  AccountsCount: any,
Adress:  any,
AuthorizedSMSCount:  any,
AuthorizedSMSCountString:  any,
AutoLockCtmByResInDay:  any,
AutoLockCtmByResInDayStatusEnumValue: any,
AutoLockCtmByTnvInDay:  any,
AutoLockCtmByTnvInDayStatusEnumValue: any,
AutoShowMsg4PaymentInvoiceByResInDay: any,
AutoShowMsg4PaymentInvoiceByTnvInDay:  any,
AutoShowMsg4PaymentInvoiceStatusEnumByResValue: any,
AutoShowMsg4PaymentInvoiceStatusEnumByTnvValue: any,
CanAddCars:  any,
CarCount:  any,
ConditionalSpeedForcedArmKmh: any,
Config:  any,
CustomerLockedStateEnum: any,
CustomerStatus: any,
CustomerStatusEnum: any,
CustomerType: any,
DownloadPassword:  any,
Email1:  any,
Email2: any,
Email3:  any,
ExpirationDateForResellerGMT:  any,
ExpirationDateForTnvGMT:  any,
ExpirationDateStatusEnumValueForReseller: any,
ExpirationDateStatusEnumValueForTunav:  any,
GMT: any,
Id:  any,
IsAuthorizedSMSEnable:  any,
IsAuthorizedToUseGooglePlanMaps: any,
IsAuthorizedToUseGoogleSatelliteMaps:  any,
IsAuthorizedToUseHereMaps: any,
IsAuthorizedToUseOSMMaps: any,
IsAuthorizedToUseTunavMaps:  any,
IsEnableLoadDelegation: any,
IsGeocodingFromGoogleSvcAndPlace:  any,
IsGeocodingFromOSMSvcAndPlace:  any,
IsGeocodingFromSTDPlaceAndPlace:  any,
IsGeocodingFromTunavSvcAndPlace:  any,
IsLocked:  any,
IsReseller:  any,
IsTunavAdmin:  any,
LastAutoMsg4PaymentInvoiceShowedByResState:  any,
LastAutoMsg4PaymentInvoiceShowedByTnvState:  any,
LastConnectionDateGMT:  any,
LastConnectionInfo:  any,
LastConnectionStatusEnumValue:  any,
LastLockedCtmByResState:  any,
LastLockedCtmByTnvState:  any,
LastLockedManuallyCtmByResState:  any,
LastLockedManuallyCtmByTnvState:  any,
MailForAllCar:  any,
MarketingFormulaContractValue: any,
MarketingFormulaContractValueString:  any,
MessageToShow:  any,
Name:  any,
NbrAuthorizedSMSBySingleNumber:  any,
NbrEq:  any,
NbrEqConnectedFromXTime:  any,
NbrEqDisconnectedMoreThanXTime:  any,
Reseller:  any,
SendMailToCtmWhenAutoMsg4PaymentInvoiceShowed:  any,
SendMailToResWhenAutoCtmLocked:  any,
SendMailToResWhenAutoMsg4PaymentInvoiceShowed:  any,
SendMailToTnvWhenAutoCtmLockedByRes:  any,
SendMailToTnvWhenAutoCtmLockedByTnv:  any,
SendMailToTnvWhenAutoCtmLockedIgnoredByTnv:  any,
SendMailToTnvWhenAutoCtmUnlockedByRes:  any,
SendMailToTnvWhenAutoCtmUnlockedByTnv:  any,
SendMailToTnvWhenAutoMsg4PaymentInvoiceShowed:  any,
SendSMSToCtmWhenAutoMsg4PaymentInvoiceShowed:  any,
SendSMSToResWhenAutoCtmLocked:  any,
SendSMSToResWhenAutoMsg4PaymentInvoiceShowed:  any,
SendSMSToTnvWhenAutoCtmLockedByRes:  any,
SendSMSToTnvWhenAutoCtmLockedByTnv:  any,
SendSMSToTnvWhenAutoCtmLockedIgnoredByTnv:  any,
SendSMSToTnvWhenAutoCtmUnlockedByRes:  any,
SendSMSToTnvWhenAutoCtmUnlockedByTnv:  any,
SendSMSToTnvWhenAutoMsg4PaymentInvoiceShowed:  any,
SiteName: any,
SmsForAllCar:  any,
SubcriptionWebAccountStatusEnumForReseller:  any,
SubcriptionWebAccountStatusEnumForTunav:  any,
SubscriptionDate: any,
Tel1:  any,
Tel2:  any,
Tel3:  any,
TimeOutToSendCommandMn:  any,
URL:  any,
UseCustomGrpSMSModem:  any,
Website:  any,
m_Config:  any
} 
export interface Articles {
  ID: string;
  Name: string;
}
export interface Beneficier {
  ID: string;
  Name: string;
}
export interface Beneficier1 {
  Account: any;
  Account_ID: any;
  Customer: any;
  Customer_ID: any;
  Department: any;
  Department_ID: any;
  Driver: any;
  Driver_ID: any;
  FirstName: any;
  ID: any;
  IsDeleted: any;
  SaveDate: any;
  TrackingTarget: any;
  TrackingTarget_ID: any;
}
export interface operation {
  ActionDate: any;
BenefAcc: any;
BenefDep: any;
BenefDri: any;
BenefTT: any;
Beneficiary: any;
Bills: any;
CategoryID: any;
Customer: any;
DeliveryForm: any;
DiscountPercents: any;
ID: any;
ModelID: any;
MvtType: any;
MvtTypeStr: any;
OrderForm: any;
PUHT: any;
PUTTC: any;
Product: any;
Quantity: any;
QuantityString: any;
Reference: any;
RequestedQuantities: any;
StoragePlace: any;
Supplier: any;
TVAInPercents: any;
TotalCost: any;
}