import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { GpsData } from 'app/main/monitoring/trajectory/trajectory.model';
import { decrypt } from 'app/main/parc/Parc';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexAnnotations,
  ApexYAxis,
  ApexNoData,
  ApexTooltip
} from "ng-apexcharts";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Tank } from '../tank-monitor.component';
import { TankMonitorService } from '../tank-monitor.service';
import { HistoryService } from './history.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  annotations: ApexAnnotations;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  labels: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  yaxis: ApexYAxis,
  noData: ApexNoData;
  tooltip: ApexTooltip;
};

export class History {
  Id : number;
  FuelLevel: number;
  AcquisitionTime : Date;
  constructor(data) {
    data = data || {};
    this.FuelLevel = data.FuelLevel;
    this.AcquisitionTime = new Date(parseInt(data.AcquisitionTime.substr(6)));
   
  }
}
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, OnDestroy {


  @ViewChild("chart", { static: false }) chart: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public chart2Options: Partial<ChartOptions>;


  FromDate: string;
  ToDate: string;
  histories: History[] = [];
  selectedRange: number;
  tank: Tank;
  yRefulling: string;
  yDraining: string;
  no_data: string;
    // Private
    private _unsubscribeAll: Subject<any>;
  gpsData: string;
  test: { x: number; y: number; }[];
  myArray= [];
  loading: boolean = false;
  constructor(
    private _historyService: HistoryService,
    private _tankMonitorService: TankMonitorService,
    private _route: ActivatedRoute,
    private _TranslateService: TranslateService) { 
         
      this.selectedRange = -1;
       // Set the private defaults
       this._unsubscribeAll = new Subject();

       this._route.paramMap
       .pipe(takeUntil(this._unsubscribeAll))
       .subscribe(params => {
           this.tank = this._tankMonitorService.data.find(t => t.Id == Number(params.get('id')));
     });
  }

  ngOnInit() {
   
    this._TranslateService.get(['Threshold_Drainage', 'Threshold_Refuelling' , 'no_data_display' ])
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(data => {
                 this.yDraining = data['Threshold_Drainage'];
                 this.yRefulling = data['Threshold_Refuelling'];
                 this.no_data = data['no_data_display'];
    });
    
    this.loading = true;

    // Subscribe to update order on changes
    this._historyService.onGpsDataChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(gpsData => {
      this.loading = false;
      this.gpsData = decrypt(gpsData);
        this.histories =Object.assign([], this.gpsData).filter(gpsdata => gpsdata.FuelLevel != "NaN" && gpsdata.FuelLevel != "-32768" ).map(g => new History(g));
    });
    console.log(this.histories);
    if(this.histories.length != 0) {
      this.FromDate = new Date(Math.min.apply(null,this.histories.map(h => h.AcquisitionTime))).toLocaleString();

      this.ToDate = new Date(Math.max.apply(null,this.histories.map(h => h.AcquisitionTime))).toLocaleString();
      
    }
    else {
      this.FromDate = '';
      this.ToDate = '';
    }
    let datePipe: DatePipe = new DatePipe('fr-FR')
      //  this.histories.map(g => {return {  g.AcquisitionTime.getTime(),  g.FuelLevel}})
        this.histories.forEach(element => {
          this.myArray.push([element.AcquisitionTime.getTime(), element.FuelLevel]);

         });
    this.chartOptions = {
      series: [
        {
          name: 'Volume',
          data:  this.myArray,
           
        }
      ],
      noData: {
        text: this.no_data,
        align: "center"
      },
      chart: {
       // height: 650,
        type: "line"
      },
      annotations: {
        yaxis: [
          {
            y: this.tank.threshold_Refuelling,
            borderColor: "#00E396",
            label: {
              borderColor: "#00E396",
              style: {
                color: "#fff",
                background: "#00E396"
              },
              text: this.yRefulling
            },
          },
          {
            y: this.tank.threshold_Draining,
            borderColor: "#FF0000",
            label: {
              borderColor: "#FF0000",
              style: {
                color: "#fff",
                background: "	#FF0000"
              },
              text: this.yDraining
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      
      stroke: {
        curve: "smooth"
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },
      //labels: this.histories.map(g => g.AcquisitionTime.toLocaleString()),
  
      xaxis: {
        type: "datetime",
        //tickAmount: this.histories.length != 0 ? this.histories.length : 0,
       // tickPlacement: "between",
          //min: new Date('01 Mar 2021').getTime(),
          tickAmount: 6,
        //min: new Date("01/01/2014").getTime(),
        //max: new Date("01/20/2014").getTime(),
        labels: {
          rotate: -45,
          rotateAlways: true,
          minHeight: 120,
          maxHeight: 120,
          format: "yyyy-MM-dd HH:mm:ss",

          // formatter: function(val, timestamp) {
          //   return new Date(timestamp).toLocaleString();
          // }
        },
        tooltip: {
          
          formatter : undefined
        }
      },
      yaxis: {
         title: 
          {
            text: "Niveau de carburant"
          },
          min: 0,
          max: 100,
          labels: {
            formatter: (value) => { return value + '%' }, 
            show: true
          }
            
      },
      tooltip: {
        x: {
          format: "yyyy-MM-dd HH:mm:ss",
          formatter: undefined,
        }
      }
      
    };

    this.chart2Options = {
      series: [
        {
          name: 'Volume',
          data:  this.myArray,
           
        }
      ],
      noData: {
        text: this.no_data,
        align: "center"
      },
      chart: {
       // height: 650,
        type: "line"
      },
      annotations: {
        yaxis: [
          {
            y: this.tank.threshold_Refuelling,
            borderColor: "#00E396",
            label: {
              borderColor: "#00E396",
              style: {
                color: "#fff",
                background: "#00E396"
              },
              text: this.yRefulling
            },
          },
          {
            y: this.tank.threshold_Draining,
            borderColor: "#FF0000",
            label: {
              borderColor: "#FF0000",
              style: {
                color: "#fff",
                background: "	#FF0000"
              },
              text: this.yDraining
            }
          }
        ]
      },
      dataLabels: {
        enabled: false
      },
      
      stroke: {
        curve: "smooth"
      },
      grid: {
        padding: {
          right: 30,
          left: 20
        }
      },
      //labels: this.histories.map(g => g.AcquisitionTime.toLocaleString()),
  
      xaxis: {
        type: "datetime",
        //tickAmount: this.histories.length != 0 ? this.histories.length : 0,
       // tickPlacement: "between",
          //min: new Date('01 Mar 2021').getTime(),
          tickAmount: 6,
        //min: new Date("01/01/2014").getTime(),
        //max: new Date("01/20/2014").getTime(),
        labels: {
          rotate: -45,
          rotateAlways: true,
          minHeight: 120,
          maxHeight: 120,
          format: "yyyy-MM-dd HH:mm:ss",

          // formatter: function(val, timestamp) {
          //   return new Date(timestamp).toLocaleString();
          // }
        },
        tooltip: {
          
          formatter : undefined
        }
      },
      yaxis: {
         title: 
          {
            text: "Niveau de carburant"
          },
          min: 0,
          max: 100,
          labels: {
            formatter: (value) => { return value + '%' }, 
            show: true
          }
            
      },
      tooltip: {
        x: {
          format: "yyyy-MM-dd HH:mm:ss",
          formatter: undefined,
        }
      }
      
    };
  }

  /**
     * On destroy
     */
   ngOnDestroy(): void
   {
       // Unsubscribe from all subscriptions
       this._unsubscribeAll.next();
       this._unsubscribeAll.complete();
   }

  // change period range
  changePeriod(e: number) : void {
  
    var now = new Date();
     this.selectedRange = e;
     
    switch(e) {
     case 1 : {
       this.loading = true;
       // today test
       var start = new Date();
       start.setHours(0,0,0,0);

      var end = new Date();
       end.setHours(23,59,59,999);
       this.FromDate =  start.toLocaleString();
       this.ToDate = end.toLocaleString();
       this.chart.zoomX(start.getTime(), end.getTime())
       this.loading = false;

       break;
      }
      case 2 : {
        this.loading = true;

          // yesterday
          var firstday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1); 
        
        var lastday= now;
       
        firstday.setHours(0,0,0,0);
  
         lastday.setHours(23,59,59,999);

          this.chart.zoomX(firstday.getTime(), lastday.getTime())

          this.FromDate =  firstday.toLocaleString();
          this.ToDate = lastday.toLocaleString();
          this.loading = false;

         break;
      }
      case 3 : {
        this.loading = true;

        // last week
         now = new Date();
        var firstday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7); // First day is the day of the month - the day of the week
        
        var lastday= now;
       
        firstday.setHours(0,0,0,0);
  
         lastday.setHours(23,59,59,999);
        this.chart.zoomX(firstday.getTime(), lastday.getTime())
        this.FromDate =  firstday.toLocaleString();
        this.ToDate = lastday.toLocaleString();
        this.loading = false;

        break;
      }
      
      default : {
        this.loading = true;

        now = new Date();
        var firstday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30); 
        
        var lastday= now;
       
        firstday.setHours(0,0,0,0);
  
         lastday.setHours(23,59,59,999);
        this.chart.zoomX(firstday.getTime(), lastday.getTime())
        this.FromDate =  firstday.toLocaleString();
        this.ToDate = lastday.toLocaleString();
        this.loading = false;

      }
    }

   
   // this.chartOptions.next(xaxis);
   // this.trigger();
  }
}
