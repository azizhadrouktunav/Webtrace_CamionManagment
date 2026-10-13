import { trucks } from './trucks';
import { drivers } from './drivers';
import { MAP_CENTER, TRUCK_PARK, IDLE_POINT, OFFLINE_POINT } from './geo';

/** Minimal customer map conf so Monitoring can boot without WCF. */
export const DEMO_MAP_CUSTOMER = {
  Id: 0,
  GMT: 1,
  IsAuthorizedToUseGooglePlanMaps: false,
  IsAuthorizedToUseGoogleSatelliteMaps: false,
  IsAuthorizedToUseHereMaps: false,
  IsAuthorizedToUseOSMMaps: true,
  IsAuthorizedToUseTunavMaps: false,
};

const POSITION_SEEDS = [
  TRUCK_PARK,
  MAP_CENTER,
  IDLE_POINT,
  OFFLINE_POINT,
  [34.7249, 10.7377] as [number, number],
  [34.7286, 10.741] as [number, number],
  [34.7312, 10.7372] as [number, number],
  [34.7293, 10.7671] as [number, number],
  [34.7352, 10.765] as [number, number],
  [34.7268, 10.7627] as [number, number],
  [34.7254, 10.7688] as [number, number],
  [34.7203, 10.7417] as [number, number],
];

function aspNetDate(ms: number, gmtOffset = '+0100'): string {
  return `/Date(${ms}${gmtOffset})/`;
}

function buildDemoPayload(truck: (typeof trucks)[number], index: number): any {
  const driver = drivers.find(d => d.id === truck.driverId);
  const [lat, lng] = POSITION_SEEDS[index % POSITION_SEEDS.length];
  const connected = truck.gps !== 'offline';
  const engineOn = truck.status === 'mission' && connected;
  const now = Date.now() - index * 45_000;
  const serial = `EQ-${truck.plate.replace(/\s+/g, '')}`;

  return {
    Key: index + 1,
    FullName: truck.plate,
    FullName2: truck.name,
    Latitude: lat + (index % 5) * 0.0012,
    Longitude: lng + (index % 4) * 0.0014,
    Speed: engineOn ? Math.round(28 + (index % 7) * 4) : 0,
    NearestPlace: truck.fixedStage === 'workshop'
      ? 'Zone atelier'
      : truck.fixedStage === 'pause'
        ? 'Zone pause'
        : 'Parc Salin',
    CurrentEquipmentSerialNumber: serial,
    CurrentEquipmentElement: {
      EquipementTypeEnumString: 'ETGPS',
      IsAssignedToClient: true,
      SimCardNumber: `21600${100000 + index}`,
      LastRefreshJSON: { TotalFuel: 1200 + index * 35 },
    },
    FuelLevelString: `${45 + (index % 40)} %`,
    FuelLevel: 45 + (index % 40),
    EngineTemperature: engineOn ? 85 + (index % 8) : 0,
    Temperature: 24 + (index % 6),
    IgnOn: engineOn,
    IsEngineOn: engineOn,
    MileageFloat: 120000 + index * 1370,
    SpecialityName: truck.type,
    DepartmentFullName: truck.department,
    AcquisitionTimeLocal: aspNetDate(now),
    DriverName: driver ? `${driver.firstName} ${driver.lastName}` : '',
    EngineHours: truck.engineHours || '0:00:00',
    LastAlertDescription: truck.health === 'alert'
      ? 'Alerte vitesse'
      : truck.health === 'warning'
        ? 'Maintenance à prévoir'
        : '',
    Connected: connected,
    ChassisNumber: `CH-${truck.id}`,
    BatteryLevel: connected ? 12.4 : 11.1,
    HumidityLevel: 42,
    ElockBattery: 90,
    LockStatus: false,
    SealStatus: true,
    TearDownStatus: true,
    CardId: driver ? (driver.personnelCode || '') : '',
    SNSonde1: '',
    VolumeSonde1: 0,
    TemperatureSonde1: 0,
    BatteryLevelSonde1: 0,
    StatusConnectedSonde1: false,
    waterdetected1: false,
    AdBlueLevel: 55,
    AxleWeight1st: 0,
    AxleWeight: 0,
    AxleWeight3rd: truck.axle3Weight,
    AxleWeight4th: truck.axle4Weight,
    RapidBrackings: truck.fastBrakes,
    RapidAccelerations: 0,
    UrlIconName: 'assets/images/logos/fuse.svg',
    Direction: (index * 37) % 360,
    MaintenanceReminderToDo: {},
    SignalGPS: truck.gps === 'weak' ? 1 : truck.gps === 'offline' ? 0 : 3,
    SignalGSM: connected ? 4 : 0,
  };
}

/** ~12 véhicules démo (plaques TU) pour le panneau Suivi / Monitoring. */
export const DEMO_TRACKING_OBJECTS: any[] = trucks
  .slice(0, 12)
  .map((truck, index) => buildDemoPayload(truck, index));
