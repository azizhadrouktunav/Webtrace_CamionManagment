import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { dropRight, List } from 'lodash';
import { Connection } from 'signalr-no-jquery';
import { isNullOrUndefined } from 'util';
import { locale as english } from '../../../navigation/i18n/en';
import { locale as french } from '../../../navigation/i18n/fr';
import { locale as arab } from '../../../navigation/i18n/ar';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ChartOptions } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LinearGaugeComponent } from '@syncfusion/ej2-angular-lineargauge';
import { ContainerType, Orientation, ILoadedEventArgs, LinearGaugeTheme } from '@syncfusion/ej2-lineargauge';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { MobiletankService } from '../mobiletank.service';
import { Series } from '@swimlane/ngx-charts';
import { Fuel, SerieModel } from 'app/main/parc/tank/model';

@Component({
  selector: 'app-mobiletankrealtime',
  templateUrl: './mobiletankrealtime.component.html',
  styleUrls: ['./mobiletankrealtime.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MobiletankrealtimeComponent implements OnInit, OnDestroy {

  // public chartOptions: Subject<Partial<ChartOptions>> = new Subject();

  // @ViewChildren('cmp') components:QueryList<ChartComponent>;
  @ViewChild('gauge', { static: false })
  public gauge: LinearGaugeComponent;
  @ViewChild('orientationMode', { static: false })
  public orientation: DropDownList;
  @ViewChild('containerMode', { static: false })
  public container: DropDownList;
  data: any[] = [];
  color: string;
  tankelement: Tank;
  CurrentCustomer: any;
  // custom code start
  public load(args: ILoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.gauge.theme = <LinearGaugeTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
  }
  // custom code end
  //Initializing Axes


  public Container: Object = {
    width: 13,
    roundedCornerRadius: 5,
    type: 'Thermometer'
  };
  thresholdConfig = {
    '0': { color: 'red' },
    '40': { color: 'orange' },
    '75.5': { color: 'green' }
  };
  connection: Connection;
  tanks: any[] = [];

  scheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  foregroundColor = "#9C5900";
  thick = 15;
  gaugeAppendText = "%";
  gaugeType = "full";
  size = 150;
  label = "Current Level";
  gpsData: History[];
  dialogRef: any;
  widget1SelectedYear: number = 1;


  colorScheme = {
    domain: ['#4867d2', '#5c84f1', '#89a9f4']
  };
  gradient: boolean = true;
  tank: Tank;
  showNotification: boolean;
  alerts: any[] = [];
  loading: boolean = false;
  alertsCount: number;
  EmptyTanks: boolean = false;
  index: number = -1;

  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(private _signalRService: MobiletankService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private _TranslateService: TranslateService) {

    // Set the private defaults
    this._unsubscribeAll = new Subject();

    this._fuseTranslationLoaderService.loadTranslations(arab, french, english);

  }

  ngOnInit() {

    this._signalRService.startConnection()

    this.loading = true;
    //   this.router.events.subscribe((val) => {
    //     // see also 

    //     console.log(val instanceof NavigationEnd) 
    //     if(val instanceof NavigationEnd) { 
    //     // this._signalRService.signalrConnection.stop(false, true);
    //     }

    // });

    this._signalRService.signalReceived
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        this.loading = false;
        this.CurrentCustomer = +localStorage.getItem("Customer");

       if(data[0].Customer == this.CurrentCustomer)
        {this.tanks = [];
        this.data = data;
         
       
        this.data.forEach(e => {
          if (e.Temperature >= 50) {
            this.color = 'red';
          }
          else if (e.Temperature > 25 && e.Temperature < 50) {
            this.color = 'orange';
          }
          else {
            this.color = 'green';
          }
          var Axes: Object[] = [{
            minimum: 0,
            maximum: 80,
            line: {
              width: 0
            },
            majorTicks: {
              interval: 20,
              color: '#9e9e9e'
            },
            opposedPosition: true,

            minorTicks: {
              color: '#9e9e9e'
            },
            pointers: [
              {
                value: e.Temperature,
                height: 13,
                width: 13,
                roundedCornerRadius: 5,
                type: 'Bar',
                color: this.color
              }
            ]
          }
          ];
          //Axes[0]["pointers"][0].value = e.Temperature;
          Object.assign(e, { Axes: Axes });
          this.tanks.push(new Tank(e));

        });}
        //this.tanks = this.tanks.sort((a, b) => (a.FuelContainerCapacityG < b.FuelContainerCapacityG) ? 1 : -1) 
        //this.Axes[0]["pointers"][0].value = 70;
        if (this.tanks.length == 0) {
          this.EmptyTanks = true;
         
        }
      }, err => {
        this.loading = false;
      });

    this._signalRService.onAlertsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        this.alerts = data;
        this.alertsCount = this.alerts.length;
      });

    this._signalRService.showNotification
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {

        this.showNotification = data;
      });

  }
  trigger() {
    this.changeDetectorRef.detectChanges();
  }
  ngOnDestroy(): void {
    //this._signalRService.signalrConnection.stop();
    // unsubscribe to ensure no memory leaks
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //   ngAfterViewInit() {

  //     this.components.changes.subscribe(() => {

  //       this.chartOptions.subscribe(data => {

  //     //  this.components.toArray()[this.index].updateSeries(data.series, true);
  //      // this.components.toArray()[this.index].updateOptions(data.xaxis, false, true);

  //       this.components.toArray()[this.index].zoomX(data.xaxis.min, data.xaxis.max)
  //       //updateOptions(data, true, true, true);
  //   })
  //  })
  // }
  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  trackByTankId(index: number, tank: Tank): string {
    return tank.Name;
  }
  openNotification(state: boolean) {
    this.showNotification = state;
  }
}
export class Tank {
  Id: number;
  Name: string;
  FuelType: string;
  FuelContainerCapacityInL: number;
  Customer: number;
  FuelLevelInL: number;
  FuelLevelInPercent: string;
  ContainerCapacitySonde: number;
  FuelLevel: number;
  LastSending: Date;
  Temperature: number;
  color: string;
  Equipment: string;
  //Histories : History[];
  serieModel: SerieModel[] = [];
  selectedRange: number;
  latest: Date;
  earliest: Date;
  ToDate: string;
  FromDate: string;
  Place: string;
  PresenceOfWater: boolean;
  series_: Series;
  chartOptions: Partial<ChartOptions>;
  //alerts: Alert[];
  chart: any;
  threshold_Draining: number;
  threshold_Refuelling: number;
  FuelLevelG: any;
  FuelLevelP: any;

  FuelContainerCapacityG: any;
  isPercent: boolean;
  isAlert: boolean = false;
  alertMessage: string;
  Axes: any;
  Battery: any;
  SNSonde: any;

  GMT = +localStorage.getItem("CustomerGMT");

  /**
     * Constructor
     *
     * @param data
     */
  constructor(data?) {
    var now = new Date();

    // today 
    const today = now;
    today.setHours(0, 0, 0, 0);

    now.setHours(23, 59, 59, 999);
    
    data = data || {};
    this.Id = data.Id || -1;
    this.Name = data.Name_ || '';
    this.Equipment = data.Equipment || '';
    this.FuelContainerCapacityInL = data.FuelContainerCapacityInL || 0;
    this.FuelLevelInL = data.FuelLevelInL;
    this.FuelLevelG = data.Volume ;
    this.FuelLevelP = Math.round((data.Volume *100)/ data.Capacity);
    this.FuelContainerCapacityG = data.Capacity;
    this.isPercent = data.FuelLevelInL == 0 ? true : false;


    if (data.LastSend.includes("/Date")) {
      this.LastSending = !isNullOrUndefined(data.LastSend) ? new Date(parseInt(data.LastSend.substr(6)) + this.GMT*3600*1000) : new Date();

    }
    else {
      let newDate = new Date(data.LastSend);
     let t= newDate.getTime();
      // + this.GMT*3600*1000
      //let g= this.GMT
      this.LastSending = new Date( newDate.getTime()+this.GMT*3600*1000);

    }
    this.Axes = data.Axes;
    this.Customer = data.Customer;
    this.FuelLevel = (data.Volume *100) /data.Capacity;
    this.FuelLevelInPercent = data.LatestFuelLevelPercent || '';
    this.FuelType = !isNullOrUndefined(data.FuelType) ? Fuel.find(t => t.id == data.FuelType).name : '';
    this.Temperature = data.Temperature;
    this.threshold_Draining = data.Threshold_Draining || null;
    this.threshold_Refuelling = data.Threshold_Refuelling || null;
    //this.Histories = data.Histories.map(h=> new History(h));
    this.selectedRange = -1;
    //this.series_ = new Series(this.Histories.map(p => p.FuelLevel), this.Histories.map(p => p.AcquisitionTime.toLocaleString()), this.Name);
    //var dates = this.Histories.map(p =>  p.AcquisitionTime);
    //this.latest = new Date(Math.max.apply(null,dates));
    //this.earliest = new Date(Math.min.apply(null,dates));
    this.ToDate = !isNullOrUndefined(this.latest) ? this.latest.toDateString() : '';
    this.FromDate = !isNullOrUndefined(this.earliest) ? this.earliest.toDateString() : '';
    this.Place = data.Place;
    this.PresenceOfWater = data.PresenceOfWater;
    this.Battery = data.Battery;
    this.Equipment = data.Equipment_;
    this.SNSonde = data.SNSonde_;

    if (this.FuelLevel >= 0 && this.FuelLevel < 40) {
      this.color = 'red';
    }
    else if (this.FuelLevel >= 40 && this.FuelLevel < 75.5) {
      this.color = 'orange';
    }
    else if (this.FuelLevel >= 75.5) {
      this.color = 'green';
    }
   
    if (data.LatestFuelLevelPercent == -1) {
      this.isAlert = true;
      this.alertMessage = "Donnée invalide" ;

    }
    if (data.PresenceOfWater) {
      this.isAlert = true;
      this.alertMessage = "Présence d'eau dans le carburant" ;

    }
  }

}

export class Alert {
  Id: number;
  AlertType: number;
  AcquisitionTime: string;
  Equipment: string
  Event: string;
  FuelLevel: number;
  TankName: string;
  Message: string;
  TotalFuel: number;
  constructor(data) {
    data = data || {};
    this.Id = data.Id;
    this.TankName = data.Message;
    this.FuelLevel = data.FuelLevel;
    this.AcquisitionTime = data.AcquisitionTime.startsWith("/") ? new Date(parseInt(data.AcquisitionTime.substr(6))).toLocaleString() : new Date(data.AcquisitionTime).toLocaleString();
    this.Equipment = data.Equipment;
    this.AlertType = data.AlertType;
    this.Event = (data.AlertType == 1006) ? 'Refuelling' : 'Fuel drain';
    this.Message = data.Message;
    this.TotalFuel = data.TotalFuel;
  }
} 
