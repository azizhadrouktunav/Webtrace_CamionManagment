export interface TireManagement {
    Id: number;
    TireId: string;
    Brand: string;
    Size: string;
    Type: string;
    Cost: number;
    MileageWhenPurchased: number;
    MileageExpiredWarranty: number;
    TireCarStatus: number;
    TireCarStatusName: string;
    HowIsObtained: number;
    ItCanUseOnCar: boolean;
    CurrentHeightOfTreadWearInMm: number;
    Dealer: string;
    TelDealer: string;
    ContactNameDealer: string;
    CreatedDate: Date;
    CreatedAccount: number;
    CurrentInstalledCar: number;
    CurrentInstalledAxleNbr: number;
    CurrentInstalledWheel: number;
    Customer: number;
    PurchasedDateLocal: Date;
    DateExpiredWarrantyLocal: Date;
    HowIsObtainedStr: string;
    CreatedDateLocal: Date;
    TireStr: string;
    CurrentInstalledAxleNbrName?: string;
    CurrentInstalledCarName?: string;
}
export interface TireParam {
    DicoTransportation: DicoTransportation;
    DicoAccount:DicoAccount;
    //Theme: string;
    //AccessRightsOfCurrentAccount: AccessRightsOfCurrentAccount;
    //CurrentAccount: CurrentAccount;
    //DicoAccount: DicoAccount;
}
export interface DicoAccount{
    Id:number;
    Login:string;
}
export interface CarTire{
    FullName: string;
    Icone : string;
    Key:number;

}
export interface DicoTransportation {
    CurrentDriverElement ?: any;
    FullName: string;
    FullName2 ?: any;
    FuelTheoreticalCosumptionAvg: number;
    FuelTypeEnum: number;
    FuelContainerCapacity: number;
    IconMediumName: string;
    IconSmallName: string;
    MaintenanceReminderToDo: any;
    CarDocumentReminderJSONToDo ?: any;
    AccidentDetailsReminderJSONToDo ?: any;
    BorrowedRentalCarContractJSONToDo ?: any;
    BorrowedRentalCarContractExpiredJSONToDo ?: any;
    IsCarBorrowedOrRented: boolean;
    MissionOrderReminderJSONToDo ?: any;
    DriverId: number;
    DriverName: string;
    MissionOrderReminderJSONNow ?: any;
    Weight ?: any;
    Displacement: number;
    ScannedGrayCardUrl ?: any;
    ChassisNumber ?: any;
    DateOfCirculation ?: any;
    DateOfReform ?: any;
    NomberOfPlaces: number;
    FiscalPower: number;
    RealPower: number;
    Axle1Enabled: boolean;
    DualWheelAxle1: boolean;
    Axle2Enabled: boolean;
    DualWheelAxle2: boolean;
    Axle3Enabled: boolean;
    DualWheelAxle3: boolean;
    Axle4Enabled: boolean;
    DualWheelAxle4: boolean;
    Axle5Enabled: boolean;
    DualWheelAxle5: boolean;
    Axle6Enabled: boolean;
    DualWheelAxle6: boolean;
    Visible: boolean;
    IconMediumNameWith_: string;
    IconSmallNameWith_: string;
    CurrentEquipmentElement: any;
    Key: number;
    IsAssignedNow: boolean;
    Speed: number;
    NearestPlace: string;
    AcquisitionTimeLocal: Date;
    Latitude: number;
    Longitude: number;
    CurrentEquipmentSerialNumber: string;
    MileageFloat: number;
    Connected: boolean;
    IsHardwareTempuratureInstalled: boolean;
    FuelLevel: string;
    Temperature: string;
    AcquisitionTimeString: string;
    CurrentEquipmentType: string;
    RPM: string;
    RPMString: string;
    EngineTemperature: string;
    EngineTemperatureString: string;
    IsHardwareCanBusTotalFuelInstalled: boolean;
    UrlIconName: string;
    IsTransportation: boolean;
    CurrentCarType: string;
    CurrentCarModelString: string;
    CurrentModelYear: number;
    CurrentFuelTypeEnum: string;
    CurrentCarModelEnum: number;
    CurrentCarTypeEnum: number;
    DepartmentName: string;
    DepartmentFullName: string;
    TrajectoryHexColor: string;
    TrajectoryColor: number;
    Direction: number;
    SignalGPS: number;
    SignalGSM: number;
    IgnOn: boolean;
    AccelerationPosition: number;
    AccelerationPositionString: string;
    IsEngineOn: boolean;
    LastAlertDescription: string;
    DepartmentId: number;
    CurrentTankModelEnum: number;
    CurrentTankTypeEnum: number;
    CurrentTankModelString: string;
    CurrentTankTypeString: string;
    FuelLevelString: string;
    FuelConsumptionOfDay_1: number;
    EngineHours: number;
}
export interface TireLog {
    Id: number;
    Tire: number;
    OperationDateGmt: Date;
    OperationDateLocal: Date;
    OperationType: number;
    OperationTypeName: string;
    OperationTypeEnum: number;
    OperationMileage: number;
    OperationCost: number;
    OperationHeightOfTreadWearInMm: number;
    OperationPressure: number;
    Car: number;
    AxleNumber: number;
    AxleNumberEnum: number;
    WheelPosition: number;
    WheelPositionEnum: number;
    WorkOrderNumber: string;
    AccountServiceBy: number;
    AccountWorkedBy: number;
    Description: string;
    Comment: string;
    CreatedDate: Date;
    CreatedDateLocal: Date;
    LastEditDate?: any;
    LastEditDateLocal?: any;
    LastEditAccount: number;
    Customer: number;
   
}
export interface AxleWheelDefItems{
    Axle1Enabled:boolean;
    DualWheelAxle1:boolean;
    Axle2Enabled :boolean;
     DualWheelAxle2 :boolean;
    Axle3Enabled :boolean;
    DualWheelAxle3 :boolean;
    Axle4Enabled :boolean;
    DualWheelAxle4 :boolean;
    Axle5Enabled :boolean;
    DualWheelAxle5:boolean;
    Axle6Enabled :boolean;
    DualWheelAxle6 :boolean;
}



