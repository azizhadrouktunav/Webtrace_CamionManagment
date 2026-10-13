import { isNullOrUndefined } from 'util';
import { MatTableDataSource } from '@angular/material/table';

export class CardCoupon {
    Id: number = 0;
    DriverString: string;
    Vehicle: string;
    CardCouponRef: string = '';
    DateGMT: Date ;
    QuantityL: number = 0;
    IsCard: boolean ;
    IsFree: boolean ;
    IsCoupon: boolean ;
    RecurringLoadConfig?: any;
    SupplierFuel: number = 0;
    Driver: number;
    Car: number;
    PricePerL: number;
    TotalPrice: number;
    EnableAlert: boolean;
    Customer: number;
    IsCardCouponWorkByMoney: boolean;
    DateCardCouponLocal: Date;
    SupplierFuelString: string;
    CardCoupnTypeEnumString: string;
    CardCoupnStateEnumString: string;
    Department: number;
    Tank?: number;
    Missions?: MissionCardCoupon[] | MatTableDataSource<MissionCardCoupon>;
    constructor(data?){
    data = data || {};
    this.Id = data.Id || -1
    this.CardCouponRef = data.CardCouponRef || ''
    this.DateGMT = !isNullOrUndefined(data.DateGMT)? new Date(parseInt(data.DateGMT.substr(6))) : new Date()
    this.QuantityL = data.QuantityL || 0
    this.IsCard = data.IsCard || true
    this.RecurringLoadConfig = data.RecurringLoadConfig || null
    this.SupplierFuel = data.SupplierFuel || null
    this.Driver = data.Driver || null
    this.Car = data.Car || null
    this.PricePerL = data.PricePerL || 1
    this.TotalPrice = data.TotalPrice || 1
    this.EnableAlert = data.EnableAlert || null
    this.Customer = data.Customer || null
    this.IsCardCouponWorkByMoney = data.IsCardCouponWorkByMoney || false;
    this.DateCardCouponLocal = !isNullOrUndefined(data.DateCardCouponLocal)? new Date(parseInt(data.DateCardCouponLocal.substr(6))) : new Date()
    this.IsCoupon = data.IsCoupon || false;
    this.SupplierFuelString = data.SupplierFuelString || ''
    this.CardCoupnTypeEnumString = data.CardCoupnTypeEnumString || ''
    this.CardCoupnStateEnumString = data.CardCoupnStateEnumString || ''
    this.Department = data.Department || null
    this.IsFree = data.IsFree || false
    this.Tank = data.Tank || null
    this.DriverString = data.DriverString || ''
    this.Vehicle = data.Vehicle || '';
    this.Missions = data.Missions || [];
    }
   
}
// log show in collapsed dataTable
export class MissionCardCoupon {
    Id: number;
    CardCoupon: number;
    QuantityL: number;
    PricePerL: number;
    TotalPrice: number;
    ForMissionStartDateGMT: Date;
    ForMissionEndDateGMT: Date;
    Driver: number;
    DriverName: string;
    CarName: string;
    Car: number;
    Status: number;
    Description: string;
    Customer: number;
    ForMissionEndDateLocal: Date;
    ForMissionStartDateLocal: Date;
    Tank?: any;
    Department: number;
    constructor(data?){
        data = data || {};
        this.Id = data.Id;
        this.CardCoupon = data.CardCoupon;
        this.QuantityL = data.QuantityL;
        this.PricePerL = data.PricePerL;
        this.TotalPrice = data.TotalPrice;
        this.ForMissionStartDateGMT = !isNullOrUndefined(data.ForMissionStartDateGMT)? new Date(parseInt(data.ForMissionStartDateGMT.substr(6))) : null;
        this.ForMissionEndDateGMT = !isNullOrUndefined(data.ForMissionEndDateGMT)? new Date(parseInt(data.ForMissionEndDateGMT.substr(6))) : null;
        this.Driver = data.Driver;
        this.Car = data.Car;
        this.Status = data.Status;
        this.Description = data.Description;
        this.Customer = data.Customer;
        this.ForMissionEndDateLocal = !isNullOrUndefined(data.ForMissionEndDateLocal)? new Date(parseInt(data.ForMissionEndDateLocal.substr(6))) : null;
        this.ForMissionStartDateLocal = !isNullOrUndefined(data.ForMissionStartDateLocal)? new Date(parseInt(data.ForMissionStartDateLocal.substr(6))) : null;
        this.DriverName = '';
        this.CarName = '';
    }
}

export const SupplierFuelEnum: any[] = 
        [{id:1 , name: 'Esso'}, {id:2 , name: 'Shell'},
        {id:3 , name: 'OilLibya'},  {id:4, name: 'StarsOil'},
        {id:5 , name: 'Agil'},{id:6 , name: 'Total'},
        {id:7 , name: 'Unknown'}
    ];
