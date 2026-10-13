export class Alert {
    
key: number
AccelerationPosition: number
AccelerationPositionString: string
AcquisitionTimeLocal: string
AcquisitionTimeLocalString: string
AirConditioning: boolean
AlertTypeAll: number
AlertTypeFrenchString: string
AxleWeight: string
BrakePedal: boolean
CentralLock: boolean
ClutchPedal: boolean
CruiseControl: boolean
CumulativeFuelConsumptionInL: number
Description: string
Direction: number
Doors: boolean
DriverDoor: boolean
DriverSeatbelt: boolean
EngineHours: number
EngineTemperature: number
EngineTemperatureString: string
FrontFogLight: boolean
FuelLevel: number
FuelLow: boolean
GPSLevel: number
GSMLevel: number
Handbrake: boolean
HazardLight: boolean
HighBeams: boolean
Hood: boolean
IgnOn: boolean
Latitude: number
Longitude: number
Mileage: number
NearestPlaceString: number
OnMove: boolean
PassengerDoor: boolean
PhotoServerPath: string
RPM: number
RPMString: string
RearFogLight: boolean
RearLeftDoor: boolean
RearRightDoor: boolean
ReceivedMessage: string
ReverseGear: boolean
RuningLight: boolean
Speed: string
Temperature: number
TemperatureString: string
TrackingObjectName: string
Trunk: boolean
ChassisNumber : string
} 
export class Map<T> {
    private items: { [key: string]: T };

    constructor() {
        this.items = {};
    }

    add(key: string, value: T): void {
        this.items[key] = value;
    }

    has(key: string): boolean {
        return key in this.items;
    }

    get(key: string): T {
        return this.items[key];
    }
}