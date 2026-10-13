import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { decrypt } from 'app/main/parc/Parc';
import { SharedreportdataService } from 'app/main/reports/services/sharedreportdata.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PompeMonitorService } from '../pompe-monitor.service';

@Component({
  selector: 'app-pompereportresult',
  templateUrl: './pompereportresult.component.html',
  styleUrls: ['./pompereportresult.component.scss']
})
export class PompereportresultComponent implements OnInit {
  loading: boolean;
  car: any;
  startdate: any;
  enddate: any;
  CarMatricule: any;
  data: any;
  destroy: Subject<boolean> = new Subject<boolean>();
  datasource: MatTableDataSource<unknown>;
  datapump: any;
  histories: any;
  historiesface2: any;
  historiesface1: any;

  constructor(private _SharedreportdataService: SharedreportdataService,
    private _pumpService: PompeMonitorService,
    private translateService: TranslateService,
    ) { }

  async ngOnInit() {
    //this.loading = true;
    await this.getparams();

    

    {

      this.translateService.get(['NAV.RealAvgFuelConsumption', 'NAV.RealSumFuelConsumption',
        'NAV.TraveledDistance'])
        .subscribe(data => { this.data = data });
      this._pumpService.getPupmReport(this.car, this.startdate, this.enddate)
        .pipe(takeUntil(this.destroy))
        .subscribe(data => {

           
          this.loading = false;
          this.datapump = decrypt(data);

          this.historiesface1 =Object.assign([], this.datapump).filter(d =>  d.Volume != 0  && d.Volume2 != 0 );
          this.historiesface2 =Object.assign([], this.datapump).filter(d =>   d.Volume2 != 0 );
          this.histories =  this.historiesface1.concat( this.historiesface2);
          this.datasource = new MatTableDataSource();

        });
  }

}    
    getparams() {
      this._SharedreportdataService.fetchParams().subscribe(params => {
        this.car = params.param1;
        this.startdate = params.param2;
        this.enddate = params.param3;
        
        this.CarMatricule = params.param10;
      });
  
  
    } 
    
    downloadPdf()
    {

    }

    exportpdf(){

    }

    exportexcel(){

    }
    }
  
