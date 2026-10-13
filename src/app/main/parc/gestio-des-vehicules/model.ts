import { FuseUtils } from '@fuse/utils'
import { environment } from 'environments/environment'
import { isEmpty, isUndefined } from 'lodash'
import { isNullOrUndefined } from 'util'

export class Vehicle {
Key: number // form
ChassisNumber: string // form
CurrentCarModelEnum: number // form
CurrentCarTypeEnum: number // form
DateOfCirculation: Date // date form
DateOfReform: Date // form
Department: number; // form
Speciality:number;
SpecialityName:string;
Displacement: number; // form
FiscalPower: number; // form
FuelContainerCapacity: number; // form
FuelTheoreticalCosumptionAvg: number; // form
FuelTypeEnum: string 
FullName: string
FullName2: string
IconName: string
Mileage: number // form
ModelYear: number // form
NomberOfPlaces: number // form
RealPower: number; // form
chipNumber: number; // form
ScannedGrayCardUrl: string // form
ScannedCarUrl: string // form
SimCardNumber: string
Weight: string // form
IsTransportation: boolean // form
UrlIconName: string
CurrentModelYear: number
Connected: boolean;
LastName: string; // form
FirstName: string; // form
IconMediumName: string;
IconSmallName: string;
Email: string; // form
FixTelphoneNumber: string; // form
MobileTelephoneNumber: string; // form
Visible: boolean;
IconMediumNameWith_: string;
IconSmallNameWith_: string;
CurrentEquipmentElement?: any;
IsAssignedNow: boolean;
Speed: number;
NearestPlace: string;
AcquisitionTimeLocal: Date;
Latitude: number;
Longitude: number;
CurrentEquipmentSerialNumber: string;
MileageFloat: number;
IsHardwareTempuratureInstalled: boolean;
FuelLevel: string;
Temperature: string;
AcquisitionTimeString: string;
CurrentEquipmentType: string;
RPM: string;
RPMString: string;
EngineTemperature: string;
EngineTemperatureString: string;
DriverName: string;
IsHardwareCanBusTotalFuelInstalled: boolean;
CurrentCarType: string;
CurrentCarModelString: string;
CurrentFuelTypeEnum: string;
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
DepartmentId: number; // form
CurrentTankModelEnum: number;
CurrentTankTypeEnum: number;
CurrentTankModelString: string;
CurrentTankTypeString: string;
FuelLevelString: string;
FuelConsumptionOfDay_1: number;
EngineHours: number;
DriverId: number;
BatteryLevel :number;
HumidityLevel:number;
ElockBattery:number;
LockStatus:string;
SealStatus:string;
TearDownStatus:string;
TotalFuel : number;
CardId : string;
SNSonde1 : string;
VolumeSonde1 : number;
TemperatureSonde1 : number;
BatteryLevelSonde1 : number;
StatusConnectedSonde1 : string;
waterdetected1 : string;
AdBlueLevel : number;

constructor(data?){
    data = data || {};
    this.Key = data.Key || -1;
    this.CurrentCarModelString = data.CurrentCarModelString;
    this.CurrentCarType = data.CurrentCarType;
    this.CurrentFuelTypeEnum = data.CurrentFuelTypeEnum;
    this.CurrentEquipmentSerialNumber = data.CurrentEquipmentSerialNumber;
    this.ChassisNumber = data.ChassisNumber || '';
    this.CurrentCarModelEnum = data.CurrentCarModelEnum || -1;
    this.CurrentCarTypeEnum = data.CurrentCarTypeEnum || -1;
    this.DateOfCirculation = !isNullOrUndefined(data.DateOfCirculation) ? new Date(parseInt(data.DateOfCirculation.substr(6))) : new Date();
    this.DateOfReform = !isNullOrUndefined(data.DateOfReform) ? new Date(parseInt(data.DateOfReform.substr(6))) : new Date();
    this.Department = data.Department;
     this.Speciality = data.Speciality || 0;
    this.SpecialityName= data.SpecialityName;
    this.Displacement = data.Displacement || 0;
    this.DriverId = data.DriverId || -1;
    this.FiscalPower = data.FiscalPower || 0;
    this.FuelContainerCapacity = data.FuelContainerCapacity || 0;
    this.FuelTheoreticalCosumptionAvg = data.FuelTheoreticalCosumptionAvg || 0;
    this.FuelTypeEnum = data.FuelTypeEnum || -1;
    this.FullName = data.FullName || '';
    this.FullName2 = data.FullName2 || '';
    this.IconName = data.IconName || "car-32x32";
    this.MileageFloat = data.MileageFloat || 0;
    this.ModelYear = data.ModelYear || 0;
    this.NomberOfPlaces = data.NomberOfPlaces || 0;
    this.RealPower = data.RealPower || 0;
    this.ScannedGrayCardUrl = data.ScannedGrayCardUrl || "";
    this.ScannedCarUrl = data.ScannedCarUrl || "";
    this.SimCardNumber = data.SimCardNumber || "0";
    this.Weight = data.Weight || "";
    this.CurrentModelYear = data.CurrentModelYear || 0;
    this.IsTransportation = data.IsTransportation;
    this.FirstName = data.FirstName || '';
    this.LastName = data.LastName || '';
    this.Email = data.Email || '';
    this.MobileTelephoneNumber = data.MobileTelephoneNumber || 0;
    this.FixTelphoneNumber = data.FixTelphoneNumber || 0;
    this.DepartmentId = data.DepartmentId || -1;
    this.UrlIconName = environment.iconUrl+'/'+data.UrlIconName || 'army-officer-32x32';
    this.IconMediumName = data.IconMediumName;
    this.DriverName = data.DriverName;
    this.DepartmentName = data.DepartmentName;
    this.CurrentEquipmentElement= data.CurrentEquipmentElement;
    this.Connected = data.Connected;
    this.BatteryLevel= data.BatteryLevel;
    this.HumidityLevel= data.HumidityLevel ||"0";
    this.ElockBattery=data.ElockBattery ||"0";
    if(data.LockStatus== true)
    this.LockStatus="fermé";
    else
    this.LockStatus="ouvert";
    if(data.SealStatus== true)
            this.SealStatus="fermé";
            else
            this.SealStatus="ouvert";
    if(data.TearDownStatus == true)
    this.TearDownStatus="non démonté"
    else
    this.TearDownStatus="démonté"
    this.CardId=data.CardId || "";

    if(data.StatusConnectedSonde1== true)
    this.StatusConnectedSonde1="Connectée";
    else
    this.StatusConnectedSonde1="Non connectée";
    if(data.waterdetected1== true)
            this.waterdetected1="Présence d'au détectée";
            else
            this.waterdetected1="Pas de présence d'eau";

            this.SNSonde1= data.SNSonde1 || "";
            this.VolumeSonde1= data.VolumeSonde1 || "0";
            this.TemperatureSonde1= data.TemperatureSonde1 || "0";
            this.BatteryLevelSonde1= data.BatteryLevelSonde1 || "0";

            this.AdBlueLevel= data.AdBlueLevel ;

   if(data.CurrentEquipmentElement != undefined)
   {
    if(data.CurrentEquipmentElement.LastRefreshJSON != undefined)
    this.TotalFuel=data.CurrentEquipmentElement.LastRefreshJSON.TotalFuel;

   }
    
    else 
     this.TotalFuel = 0;
}


}

export class Operation {
    Id: number;
    Car: number;
    Customer: number;
    OperationDateLocal: Date;
    OperationType: number;
    Type?: string;
    OperationMileage: number;
    OperationCost: number;
    Driver: number;
    DriverName?: string;
    Department: number;
    DepartmentName?: string;
    AccountWorkedBy: number;
    AccountName? : string;
    Description?: any;
    Comment?: any;
    CreatedDateGmt: Date;
    LastEditDateGmt?: any;
    LastEditAccount: number;
    constructor(data?, drivers?, departments?, accounts?){
        data = data || {};
        this.Id = data.Id;
        this.Car = data.Car;
        this.Customer =data.Customer;
        this.OperationDateLocal = !isNullOrUndefined(data.OperationDateLocal) ? new Date(parseInt(data.OperationDateLocal.substr(6))): new Date();
        this.OperationType = data.OperationType || 5;
        this.OperationMileage = data.OperationMileage || 0;
        this.OperationCost = data.OperationCost || 0;
        this.Driver = data.Driver || -1;
        this.Department = data.Department || -1;
        this.AccountWorkedBy = data.AccountWorkedBy;
        this.Description = data.Description || '';
        this.Comment = data.Comment || '';
        this.CreatedDateGmt = !isNullOrUndefined(data.CreatedDateGmt) ? new Date(parseInt(data.CreatedDateGmt.substr(6))) : new Date();
        this.LastEditDateGmt = !isNullOrUndefined(data.LastEditDateGmt) ? new Date(parseInt(data.LastEditDateGmt.substr(6))) : new Date();
        this.LastEditAccount =  data.LastEditAccount;
        this.Type = !isNullOrUndefined(data.OperationType) ? typeOperations.find(op => op.id === data.OperationType).name : undefined;
        let driver, dep, acc ;
        driver = !isNullOrUndefined(drivers) ? drivers.find(d => d.Id === data.Driver) : undefined;
        dep =  !isNullOrUndefined(departments) ? departments.find(department => department.Id == data.Department) : undefined;
        acc = !isNullOrUndefined(accounts) ? accounts.find(acount => acount.Id == data.AccountWorkedBy) : undefined;
        this.DriverName = driver? driver.Name : '';
        this.DepartmentName = dep ? dep.Name : '';
        this.AccountName = acc? acc.Name : ''; 
    }
}

export const typeOperations = [   
    {id: 5, name: 'rugged'},
    {id: 0, name: 'purchased'},
    {id: 4, name: 'stopped'},
    {id: 2, name: 'giveUp'},
    {id: 6, name: 'lend'},
    {id: 3, name: 'reformed'},
    {id: 1, name: 'sold'},
  ];

        
        