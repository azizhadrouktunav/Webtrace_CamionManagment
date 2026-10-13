import { FuseUtils } from "@fuse/utils";

    export class GpsData {
        Acceleration: number;
        AccelerationPosition: number;
        AcquisitionTime: string;
        AirConditioning: boolean;
        BeginDateLocal: Date;
        BeginDateLocalString: string; // Date
        BrakePedal: boolean; // Brake pedal
        CentralLock: boolean; // central lock
        ClutchPedal: boolean; // clutch pedal
        CruiseControl: boolean; // cruise control
        CumulativeDistanceString: number;
        CumulativeFuelConsumptionInL: number;
        Direction: number; // 
        DistanceAtRunStatus: number;
        Doors: boolean; // Doors all 
        DriverDoor: boolean; // Driver Door
        DriverSeatbelt: boolean; // Driver Seat belt
        EcondedLatLng: string;
        EndDateLocal: Date;
        EngineHours: number; // Engine hour/meter
        EngineOnInStopStateString: string;
        EngineTemperature: number; // engine temperature
        FilledQuantityString: string;
        FrontFogLight: boolean; // Front fog light
        FuelConsumptionAvgInL100Km: number;
        FuelConsumptionInLAtRunStatus: number;
        FuelLevel: number; // fuel level
        FuelLevelString: string;
        FuelLow: boolean; // fuel low
        Handbrake: boolean; // HandBrake
        HazardLight: boolean;// Hazard light
        HighBeams: boolean; // 
        Hood: boolean; // 
        Id: number;
        IgnOn: boolean;
        IsCamreaData: boolean;
        IsRunning: boolean;
        IsSOSData: boolean;
        IsTruhPositionOfStop: boolean;
        Latitude: number;
        Longitude: number;
        Mileage: number;
        MileageString: string;
        NearestPlaceString: string;
        OnMove: boolean;
        PassengerDoor: boolean; //
        Period: string;
        PeriodInMilliseconds: number;
        PeriodString: string;
        PhotoServerPath: string;
        PriceOfFilledQuantityString: string;
        RPM: number;
        RearFogLight: boolean;
        RearLeftDoor: boolean;
        RearRightDoor: boolean;
        ReverseGear: boolean;
        RuningLight: boolean;
        Speed: number;
        SpeedAverageAtRunStatus: number;
        SpeedAverageBetweenPreviousStop: number;
        StandardPlaceReferenceName: string;
        StopRunStatusEnum: number;
        StopRunStatusEnumString: string;
        Temperature: number;
        TemperatureString: string;
        Trunk: boolean; // trunk
        TruthLatitude: number; // 
        TruthLongitude: number; //
        URL: string;
        Matricule:string;
        IsAlert: boolean; // trunk
        DesAlert : string;
        DisabledStop: boolean;
        DisabledStar:boolean;
        StopRunStatusEnumString2: string;
        LowBeams:boolean;
        Webcast:boolean;
        BrakeFluidLowIndicator:boolean;
        CoolantLevelLowIndicator:boolean;
        BatteryIndicator:boolean;
        BrakeFailureIndicator:boolean;
        OilPressureIndicator:boolean;
        EngineHotIndicator:boolean;
        ABSFailureIndicator:boolean;
        CheckEngine:boolean;
        AirBagIndicator:boolean;
        ServiceCallIndicator:boolean;
        OilLevelLowIndicator:boolean;
        BatteryCharging:boolean;
        FuelSource:boolean;
        PTO:boolean;




        constructor(data?) {
            
            data = data || {};
            this.Acceleration = data.Acceleration;
            this.AccelerationPosition = data.AccelerationPosition;
            this.AcquisitionTime = data.AcquisitionTime;
            this.AirConditioning = data.AirConditioning;
            this.BeginDateLocal = data.BeginDateLocal;
            this.BeginDateLocalString = data.BeginDateLocalString;
            this.BrakePedal = data.BrakePedal;
            this.CentralLock = data.CentralLock;
            this.ClutchPedal = data.ClutchPedal;
            this.CruiseControl = data.CruiseControl;
            this.CumulativeDistanceString = data.CumulativeDistanceString;
            this.CumulativeFuelConsumptionInL = data.CumulativeFuelConsumptionInL;
            this.Direction = data.Direction;
            this.DistanceAtRunStatus = data.DistanceAtRunStatus;
            this.Doors = data.Doors;
            this.DriverDoor = data.DriverDoor;
            this.DriverSeatbelt = data.DriverSeatbelt;
            this.EcondedLatLng = data.EcondedLatLng;
            this.EndDateLocal = data.EndDateLocal;
            this.EngineHours = data.EngineHours;
            this.EngineOnInStopStateString = data.EngineOnInStopStateString;
            this.FilledQuantityString = data.FilledQuantityString;
            this.FrontFogLight = data.FrontFogLight;
            this.EngineTemperature = data.EngineTemperature;
            this.FuelConsumptionAvgInL100Km = data.FuelConsumptionAvgInL100Km;
            this.FuelConsumptionInLAtRunStatus = data.FuelConsumptionInLAtRunStatus;
            this.FuelLevel = data.FuelLevel;
            this.FuelLevelString = data.FuelLevelString; 
            this.FuelLow = data.FuelLow;
            this.Handbrake = data.Handbrake;
            this.HighBeams = data.HighBeams;
            this.Hood = data.Hood;
            this.Id = data.Id;
            this.IgnOn = data.IgnOn;
            this.IsCamreaData = data.IsCamreaData;
            this.IsRunning = data.IsRunning;
            this.IsSOSData = data.IsSOSData;
            this.IsTruhPositionOfStop = data.IsTruhPositionOfStop;
            this.Latitude = data.Latitude;
            this.Longitude = data.Longitude;
            this.Mileage = data.Mileage; //
            this.NearestPlaceString = data.NearestPlaceString; // place
            this.OnMove = data.OnMove; 
            this.PassengerDoor = data.PassengerDoor;
            this.Period = data.Period;
            this.PeriodInMilliseconds = data.PeriodInMilliseconds;
            this.PeriodString = data.PeriodString;
            this.PhotoServerPath = data.PhotoServerPath;
            this.PriceOfFilledQuantityString = data.PriceOfFilledQuantityString;
            this.RPM = data.RPM; // RPM(tr/min)
            this.RearFogLight = data.RearFogLight; //
            this.RearLeftDoor = data.RearLeftDoor; //   
            this.RearRightDoor = data.RearRightDoor; //
            this.ReverseGear = data.ReverseGear; //
            this.RuningLight = data.RuningLight; //
            this.Speed = data.Speed; //
            this.SpeedAverageAtRunStatus = data.SpeedAverageAtRunStatus;
            this.SpeedAverageBetweenPreviousStop = data.SpeedAverageBetweenPreviousStop;
            this.StandardPlaceReferenceName = data.StandardPlaceReferenceName;
            this.StopRunStatusEnum = data.StopRunStatusEnum;
            this.StopRunStatusEnumString = data.IsRunning == true ? 'Circulation' : 'Stop';
            this.Temperature = data.Temperature;
            this.TemperatureString = data.TemperatureString;
            this.TruthLatitude = data.TruthLatitude;
            this.URL = data.URL;
            this.Matricule=data.Matricule;
             
            this.IsAlert=data.IsAlert;
            this.DesAlert = data.DesAlert;
            this.DisabledStop= data.DisabledStop;
            this.DisabledStar=data.DisabledStar;
            this.StopRunStatusEnumString2= this.StopRunStatusEnumString;

            this.LowBeams=data.LowBeams;
            this.Webcast=data.Webcast;
            this.BrakeFluidLowIndicator=data.BrakeFluidLowIndicator;
            this.CoolantLevelLowIndicator=data.CoolantLevelLowIndicator;
            this.BatteryIndicator=data.BatteryIndicator;
            this.BrakeFailureIndicator=data.BrakeFailureIndicator;
            this.OilPressureIndicator=data.OilPressureIndicator;
            this.EngineHotIndicator=data.EngineHotIndicator;
            this.ABSFailureIndicator=data.ABSFailureIndicator;
            this.CheckEngine=data.CheckEngine;
            this.AirBagIndicator=data.AirBagIndicator;
            this.ServiceCallIndicator=data.ServiceCallIndicator;
            this.OilLevelLowIndicator=data.OilLevelLowIndicator;
            this.BatteryCharging=data.BatteryCharging;
            this.FuelSource=data.FuelSource;
            this.PTO=data.PTO;

        }
    }
    export class Trajectory {
        id: string;
        AlertHarshAccelerationNumber: number;
        AlertHarshAccelerationOrBrakingNumber: number;
        AlertHarshBrakingNumber: number;
        AlertOverSpeed: any[];
        AlertOverSpeedNumber: number;
        AlertRPMOutOfRangeNumber: number;
        AllExtendedGpsData: GpsData[];
         // AllExtendedGpsDataStopRunState
        AllExtendedGpsDataStopRunState: GpsData[];
        CirculationRateInPercent: number;
        CurrentScore: number;
        Distance: number;
        Driver: string;
        EndDateLocal: Date;
        EngineOnInStopStateStr: string;
        EngineOnItemInStopState: any[];
        EngineRunPeriodString: string;
        EquipmentString: string;
        FuelRealConsumptionAvgString: string; //
        FuelRealConsumptionSumString: string; //
        FuelTheoreticalConsumptionAvgString: string;
        FuelTheoreticalConsumptionInL: number;
        Matricule: string;
        MinutesOfOverspeed: number;
        NbrAlertOutArea: number;
        NbrKmOut: number;
        NbrKmWeekend: number;
        NbrOverSpeedMoreThan3shold: number;
        NbrRPMMoreThan3sholdStr: string;
        OutOfWorkRate: string;
        OverSpeedExtendedGpsDataList: any[];
        OverSpeedNumber: number;
        RealAvgFuelConsumption: number;
        RealSumFuelConsumption: number;
        RunTimeString: string;
        SpeedAvg: number;
        SpeedAvgString: string;
        SpeedMax: number;
        StartDateLocal: Date;
        StateEngineItems: any[];
        StopNumber: number;
        StopRate: string;
        StopTime: string;
        StopTimeString: string;
        TotalFilledQuantity: number;
        m_NbrAlertOutArea: number;
        m_NbrKmOut: number;
        m_NbrKmWeekend: number;
        m_StopRate: string;
        constructor(data?) {
            data = data ||{};
            this.id = FuseUtils.generateGUID();
            this.AlertHarshAccelerationNumber = data.AlertHarshAccelerationNumber;
            this.AlertHarshBrakingNumber = data.AlertHarshBrakingNumber;
            this.AlertOverSpeed = data.AlertOverSpeed;
            this.AlertOverSpeedNumber = data.AlertOverSpeedNumber;
            this.AlertRPMOutOfRangeNumber = data.AlertRPMOutOfRangeNumber;
            this.AllExtendedGpsData = data.AllExtendedGpsData;
            this.AllExtendedGpsDataStopRunState =  data.AllExtendedGpsDataStopRunState; 
            this.CirculationRateInPercent = data.CirculationRateInPercent;
            this.CurrentScore =  data.CurrentScore;
            this.Distance = data.Distance;
            this.Driver = data.Driver;
            this.EndDateLocal = data.EndDateLocal;
            this.EngineOnInStopStateStr = data.EngineOnInStopStateStr;
            this.EngineOnItemInStopState = data.EngineOnItemInStopState;
            this.EngineRunPeriodString = data.EngineRunPeriodString;
            this.EquipmentString = data.EquipmentString;
            this.FuelRealConsumptionAvgString = data.FuelRealConsumptionAvgString;
            this.FuelRealConsumptionSumString = data.FuelRealConsumptionSumString;
            this.FuelTheoreticalConsumptionAvgString = data.FuelTheoreticalConsumptionAvgString;
            this.FuelTheoreticalConsumptionInL = data.FuelTheoreticalConsumptionInL;
            this.MinutesOfOverspeed = data.Matricule;
            this.NbrAlertOutArea = data.NbrAlertOutArea;
            this.NbrKmWeekend = data.NbrKmWeekend;
            this.NbrKmOut = data.NbrKmOut;
            this.NbrOverSpeedMoreThan3shold = data.NbrOverSpeedMoreThan3shold;
            this.NbrRPMMoreThan3sholdStr = data.NbrRPMMoreThan3sholdStr;
            this.OutOfWorkRate = data.OutOfWorkRate;
            this.OverSpeedExtendedGpsDataList = data.OverSpeedExtendedGpsDataList;
            this.OverSpeedNumber = data.OverSpeedNumber;
            this.RealAvgFuelConsumption = data.RealAvgFuelConsumption;
            this.RealSumFuelConsumption = data.RealSumFuelConsumption;
            this.RunTimeString = data.RunTimeString;
            this.SpeedAvg = data.SpeedAvg;
            this.SpeedAvgString = data.SpeedAvgString;
            this.SpeedMax = data.SpeedMax;
            this.StartDateLocal = data.StartDateLocal;
            this.StateEngineItems = data.StateEngineItems;
            this.StopNumber = data.StopNumber;
            this.StopRate = data.StopRate;
            this.StopTime = data.StopTime;
            this.StopTimeString = data.StopTimeString;
            this.TotalFilledQuantity = data.TotalFilledQuantity;
            this.m_NbrAlertOutArea = data.m_NbrAlertOutArea;
            this.m_NbrKmOut = data.m_NbrKmOut;
            this.m_NbrKmWeekend = data.m_NbrKmWeekend;
            this.m_StopRate = data.m_StopRate;
        }
    }