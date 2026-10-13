

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as moment from 'moment';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly API_URL = environment.apiUrl + '/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  type: string;
  EnabledDayOfWeek = "";
  elm: any;
  enddateUTC: string;
  startdateUTC: string;
  worktimefromUTC: string;
  worktimetoUTC: string;
  data: any;
  ondataChanged: Subject<any[]>;


  constructor(private http: HttpClient) {

    this.ondataChanged = new Subject();

  }

  getReportingParam(): Observable<any[]> {
    // Declare and Initialize Params Object
    let params = {};

    params['sessionId'] = localStorage.getItem('SessionId');
    return this.http.post(this.API_URL +
      'ReportingWCFService.svc/GetUIReportingParamCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }

  getGeneralReport(car, startdate, enddate, emplacement, fuel, speed, rpm,
    stop, report): Observable<any[]> {

    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['FuelConsumptionAvg'] = fuel;
    params['GeneralReportTypeInt'] = report;
    params['MinStopPeriodAcceptedInS'] = stop;
    params['SpeedThreshold'] = speed;
    params['RPMThreshold'] = rpm;

    return this.http.post(this.API_URL +
      'TrackingPageWCFServiceNewtonSoft.svc/GetTrajectoryCompressedWithAllParam',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  getGeneralReportManyCar2(car, startdate, enddate, emplacement, fuel, speed, rpm,
    stop, report): Promise<any> {
    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObjects'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['FuelConsumptionAvg'] = fuel;
    params['GeneralReportTypeInt'] = report;
    params['MinStopPeriodAcceptedInS'] = stop;
    params['SpeedThreshold'] = speed;
    params['RPMThreshold'] = rpm;
    return new Promise((resolve, reject) => {
      this.http.post(this.API_URL + 'TrackingPageWCFServiceNewtonSoft.svc/GetTrajectoryCompressedWithAllParamManyCar',

        params, this.httpOptions)
        .subscribe((response: any) => {
          this.data = response;

          this.ondataChanged.next(this.data);
          //resolve(response);

        }, reject);
    });
  }
  getGeneralReportManyCar(car, startdate, enddate, emplacement, fuel, speed, rpm,
    stop, report): Observable<any[]> {

    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObjects'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['FuelConsumptionAvg'] = fuel;
    params['GeneralReportTypeInt'] = report;
    params['MinStopPeriodAcceptedInS'] = stop;
    params['SpeedThreshold'] = speed;
    params['RPMThreshold'] = rpm;

    return this.http.post(this.API_URL +
      'TrackingPageWCFServiceNewtonSoft.svc/GetTrajectoryCompressedWithAllParamManyCar',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetSpeedData(car, startdate, enddate, emplacement, speed): Observable<any[]> {

    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['SpeedThresholdKm'] = speed;


    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetSpeedReportCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetOuverSpeed(car, startdate, enddate, emplacement, fuel, speed, rpm,
    stop, report): Observable<any[]> {

    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObjects'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['FuelConsumptionAvg'] = fuel;
    params['GeneralReportTypeInt'] = report;
    params['MinStopPeriodAcceptedInS'] = stop;
    params['SpeedThreshold'] = speed;
    params['RPMThreshold'] = rpm;


    return this.http.post(this.API_URL +
      'TrackingPageWCFServiceNewtonSoft.svc/GetTrajectoryCompressedWithAllParamManyCar',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }


  GetAlertsDashboard(car, startdate, enddate) {
    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObjects'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';

    return this.http.post(this.API_URL +
      'TrackingPageWCFServiceNewtonSoft.svc/GetAlertsDashboard',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )
  }

  //get Dashboard Alerts for a signle vehicle : 
  GetAlertsDashboardSingleCar(car: number [], startdate: Date, enddate: Date) {
    const params = {
      SessionId: localStorage.getItem('SessionId'),
      KeyTrackingObjects: car,
      StartDateTimeGMT: `/Date(${startdate.getTime()})/`,
      EndDateTimeGMT: `/Date(${enddate.getTime()})/`
    };

    return this.http
      .post(
        this.API_URL + 'TrackingPageWCFServiceNewtonSoft.svc/GetAlertsDashboardSingleCar',
        JSON.stringify(params),
        this.httpOptions
      )
      .pipe(
        map((data: any[]) => data),
        catchError(error => {
          console.error("Error fetching alert dashboard data:", error);
          return throwError(() => new Error('data not found!'));
        })
      );
  }



  ExportReport(ReportDataSourceCompressed: string, TypeExport: string, TypeReport: number): Observable<string> {


    // Declare and Initialize Params Object
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['ReportDataSourceCompressed'] = ReportDataSourceCompressed;
    params['TypeExport'] = TypeExport;
    params['TypeReport'] = TypeReport;

    return this.http.post(this.API_URL +
      'CommonWCFService.svc/ExportReportNew',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: string) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )
  }
  ExportGeneralReport(BeginTimeLocal: Date, EndTimeLocal: Date, DistanceForNearest, consommation, IdTrackingObject: number,
    Emplacement, choixRapport, SpeedThreshold): Observable<any> {
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['IdTrackingObject'] = IdTrackingObject;
    params['BeginTimeLocal'] = '/Date(' + BeginTimeLocal.getTime() + ')/';
    params['EndTimeLocal'] = '/Date(' + EndTimeLocal.getTime() + ')/';
    params['DistanceForNearest'] = DistanceForNearest;
    params['consommation'] = consommation;
    params['Emplacement'] = Emplacement;
    params['choixRapport'] = choixRapport;
    params['SpeedThreshold'] = SpeedThreshold;
    return this.http.post(this.API_URL +
      'CommonWCFService.svc/ExportGeneralReport',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any) => {
          return data;

        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetRunStopState(car, startdate, enddate, emplacement): Observable<any[]> {

    // Declare and Initialize Params Object
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';


    return this.http.post(this.API_URL +
      'TrackingPageWCFServiceNewtonSoft.svc/GetRunStopStateCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetRunStopStateDistance(car, startdate, enddate, emplacement, distance): Observable<any[]> {

    // Declare and Initialize Params Object
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['distance'] = distance;

    return this.http.post(this.API_URL +
      'TrackingPageWCFServiceNewtonSoft.svc/GetRunStopStateCompressedFilter',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }

  getSummaryReport(car, startdate, enddate, emplacement, speed, rpm, vehicule
  ): Observable<any> {

    // Declare and Initialize Params Object
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObjectOrDriver'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['NbrOverSpeedMoreThan3shold'] = speed;
    params['NbrRPMMoreThan3shold'] = rpm;
    params['TrackingObjOrDriver'] = vehicule;


    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetSummaryReportCompressedManyCar',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  getMonthlyReport(car, date, emplacement): Observable<string> {
    var check = moment(date, 'YYYY/MM/DD');

    var month = check.format('M');
    var day = check.format('D');
    var year = check.format('YYYY');


    // Declare and Initialize Params Object
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['YearLocal'] = year;
    params['MonthLocal'] = month;
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;


    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetMonthlyReportCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: string) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  getPassagereport(car: number[], startdate, enddate, emplacement, empllist, forstop, r
  ): Observable<any[]> {

    // Declare and Initialize Params Object
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['ListPlaceReference'] = empllist;
    params['MetreThresholdRadius'] = r;
    params['ForStop'] = forstop == 1 ? false : true;;
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;


    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetPassingKnownPlaceReportManyCarCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetTemperatureTimeReport(car, startdate, enddate, emplacement): Observable<any[]> {
    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['startDateLocal'] = '/Date(' + startdate.getTime() + ')/';
    params['endDateLocal'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;

    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetTemperatureTimeReportCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetTemperatureTimeReportWithoutExtendedGpsData(car, startdate, enddate, emplacement): Observable<any[]> {
    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['startDateLocal'] = '/Date(' + startdate.getTime() + ')/';
    params['endDateLocal'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;

    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetTemperatureTimeReportWithoutExtendedGpsData',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GetStateEngineReport(car, startdate, enddate, emplacement, StopPeriod): Observable<any[]> {

    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['startDateLocal'] = '/Date(' + startdate.getTime() + ')/';
    params['endDateLocal'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = emplacement == 1 ? false : true;
    params['StopPeriod'] = '/Date(' + StopPeriod._d.getTime() + ')/';;
    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetStateEngineReportCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  getFuelTimeReport(car, startdate, enddate, fuel, fuelcost): Observable<any[]> {
    let params = {};
    let cars = [];
    cars.push(car);

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = false;
    params['FilledQuantityInPercentMoreThan'] = +fuel;
    params['PriceByLiter'] = +fuelcost;


    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetFuelTimeReportCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return [];
        })
      )

  }
  GetFuelTimeReportWithoutGpsData(car, startdate, enddate, fuel, fuelcost): Observable<any[]> {
    let params = {};
    let cars = [];
    cars.push(car);

    params['SessionId'] = localStorage.getItem('SessionId');
    params['KeyTrackingObject'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['OnlyCustomerPlaceReference'] = false;
    params['FilledQuantityInPercentMoreThan'] = +fuel;
    params['PriceByLiter'] = +fuelcost;


    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetFuelTimeReportWithoutGpsDataCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return [];
        })
      )

  }
  getDrivingQualityReportCompressed(car, startdate, enddate, report): Observable<any[]> {

    // Declare and Initialize Params Object
    let params = {};


    params['SessionId'] = localStorage.getItem('SessionId');
    params['ListTrackingObjOrDrivingObj'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['TrackingObjOrDriver'] = report == 2 ? "driver" : "vehicule";

    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetDrivingQualityReportCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }

  GeConfigurableReport(car, startdate, enddate, report): Observable<any[]> {

    // Declare and Initialize Params Object
    let params = {};


    if (report == '2') {
      this.type = "driver";
    }
    else { this.type = "vehicule"; }
    params['SessionId'] = localStorage.getItem('SessionId');
    params['ListTrackingObjOrDrivingObj'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['TrackingObjOrDriver'] = this.type;

    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GeConfigurableReport',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  GeConfigurableReportByVeshicule(car, startdate, enddate, report): Observable<any[]> {

    // Declare and Initialize Params Object
    let params = {};


    if (report == '2') {
      this.type = "driver";
    }
    else { this.type = "vehicule"; }
    params['SessionId'] = localStorage.getItem('SessionId');
    params['TrackingObjOrDrivingObj'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['TrackingObjOrDriver'] = this.type;

    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GeConfigurableReportOnlyTraking',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return [];
        })
      )

  }
  getMissionReport(car, startdate, enddate, report, typeParam): Observable<any[]> {


    let params = {};
    params['SessionId'] = localStorage.getItem('SessionId');
    params['TrackingObjOrDrivingObj'] = car;
    params['StartDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['EndDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';
    params['TrackingObjOrDriver'] = report - 1;

    console.log('startdate test', startdate);
    console.log(this.data);
    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetMissionReportUsingGpsDataByDRVCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      );


  }

  getReportStatisticsInWork(car, startdate,
    enddate, emplacement, EnabledDayOfWeekes, worktimefrom, worktimeto, holidays) {
    this.EnabledDayOfWeek = "";
    EnabledDayOfWeekes.forEach(element => {
      this.elm = element;
      this.EnabledDayOfWeek = this.EnabledDayOfWeek + ";" + this.elm;
    });
    let listholidays = [];
    holidays.forEach(element => {
      listholidays.push('/Date(' + element._d.getTime() + ')/')

    });
    let params = {};

    this.startdateUTC = startdate.getTime() + 60 * 60 * 1000;
    this.enddateUTC = enddate.getTime() + 60 * 60 * 1000;
    this.worktimefromUTC = worktimefrom.getTime() + 60 * 60 * 1000;
    this.worktimetoUTC = worktimeto.getTime() + 60 * 60 * 1000;

    params['SessionId'] = localStorage.getItem('SessionId');
    params['TrackingObjs'] = car;
    params['StartDateTimeGMT'] = '/Date(' + this.startdateUTC + ')/';
    params['EndDateTimeGMT'] = '/Date(' + this.enddateUTC + ')/';
    params['OnlyCustomerPlaceReference'] = false;
    params['BeginBetween2TimeInMonthlyReportLocal'] = '/Date(' + this.worktimefromUTC + ')/';
    params['EndBetween2TimeInMonthlyReportLocal'] = '/Date(' + this.worktimetoUTC + ')/';
    params['CheckedDays'] = this.EnabledDayOfWeek;
    params['holidays'] = listholidays;
    return this.http.post(this.API_URL +
      'ReportingWCFServiceNtSoft.svc/GetReportStatisticsInWorkManyCarsCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )
  }

  getgeofenceReport(car, startdate, enddate): Observable<any[]> {
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['commonAlert'] = -3;
    params['keyTrackingObjects'] = car; //provisoire
    params['startDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['endDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';


    return this.http.post(this.API_URL +
      'TrackingPageWCFService.svc/GetAlertsElementManyTrackingObjectCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
  getsmartlockReport(car, startdate, enddate): Observable<any[]> {
    let params = {};

    params['SessionId'] = localStorage.getItem('SessionId');
    params['commonAlert'] = -2;
    params['keyTrackingObject'] = car;
    params['startDateTimeGMT'] = '/Date(' + startdate.getTime() + ')/';
    params['endDateTimeGMT'] = '/Date(' + enddate.getTime() + ')/';


    return this.http.post(this.API_URL +
      'TrackingPageWCFService.svc/GetAlertsElementCompressed',
      JSON.stringify(params), this.httpOptions).pipe(
        map((data: any[]) => {
          return data;
        }), catchError(error => {
          return throwError('data not found!');
        })
      )

  }
}




