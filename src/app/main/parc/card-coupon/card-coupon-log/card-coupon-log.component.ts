import { Component, OnInit, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MissionCardCoupon } from '../model';
import { CardCouponService } from '../card-coupon.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { fuseAnimations } from '@fuse/animations';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { locale as english } from '../../i18n/en';
import { locale as arabic } from '../../i18n/ar';
import { locale as french } from '../../i18n/fr';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-card-coupon-log',
  templateUrl: './card-coupon-log.component.html',
  styleUrls: ['./card-coupon-log.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations:fuseAnimations
})

export class CardCouponLogComponent implements OnInit, AfterViewInit {
  searchkey:any;
  missionCardCoupon : MissionCardCoupon[] = [];
  public displayedColumns = ['Start_date', 'End_date', 'Driver', 'Vehicle', 'PriceOfLiter', 'Quantity', 'Total_amount', 'Description'];
  public dataSource = new MatTableDataSource<MissionCardCoupon>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private couponCardService : CardCouponService,
             private translateService: TranslateService,
             private _fuseTranslationLoaderService : FuseTranslationLoaderService,private route: ActivatedRoute) { 
               // Load the translations
         this._fuseTranslationLoaderService.loadTranslations(english, french , arabic);
         //console.log(this.translateService.currentLang)
             }
             

  ngOnInit() {
    let test = this.route.snapshot.params['couponId'];
    this.getAllLogs();
  }
  ngAfterViewInit() : void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public getAllLogs = () => {
    
    this.couponCardService.getLog(this.route.snapshot.params['couponId'])
    .subscribe(res => {
      res.forEach(elt => {
        var mission = new MissionCardCoupon(elt);
        var driver = !isNullOrUndefined(mission.Driver) ? this.couponCardService.getDrivers().find(driver => driver.Id === mission.Driver) : undefined;
        var vehicle =  !isNullOrUndefined(mission.Car)? this.couponCardService.getVehicles().find(vehicle => vehicle.Id === mission.Car): undefined
        mission.DriverName = driver !== undefined  ? driver.FullName : ''; 
        mission.CarName = vehicle !== undefined ?  vehicle.FullName : '';
        this.missionCardCoupon.push(mission);
      })
      this.dataSource.data = this.missionCardCoupon;
    })
  }
  downloadPdf(){
  const doc = new jsPDF();
  var title: string;
  this.translateService.get('MissionCardCoupon').subscribe(data => {
       title = data;
  })
  
  doc.text(title , 70 ,20, { lang: this.translateService.currentLang  }); //default
  var head = [];
  var prepare=[];
    this.translateService.get(['StartDate', 'EndDate', 'Driver',
     'Vehicle', 'LittrePrice',
      'LittreQuantity', 'TotalAmount',  'Description'  ])
      .subscribe(data => {
            head.push([data.StartDate, data.EndDate, data.Driver,
               data.Vehicle, data.LittrePrice, data.LittreQuantity,
               data.TotalAmount, data.Description]);
      });
      this.missionCardCoupon.forEach(e=>{
        var tempObj =[];
        tempObj.push(e.ForMissionStartDateGMT.toDateString());
        tempObj.push(e.ForMissionEndDateGMT.toDateString());
        tempObj.push(e.DriverName);
        tempObj.push(e.CarName);
        tempObj.push(e.PricePerL);
        tempObj.push(e.QuantityL);
        tempObj.push(e.TotalPrice);
        tempObj.push(e.Description);
        prepare.push(tempObj);
      });
      doc.autoTable({
          head: head,
          body: prepare,
          startY: 20
      });
      doc.save(title + '.pdf');
  }
  downloadExcel(){
    var prepare_to_excel=[];
    let tem =[];
    var title: string;
    this.translateService.get(['StartDate', 'EndDate', 'Driver',
     'Vehicle', 'LittrePrice',
      'LittreQuantity', 'TotalAmount',  'Description' , 'MissionCardCoupon'  ])
      .subscribe(data => {
        tem.push([data.StartDate, data.EndDate, data.Driver,
               data.Vehicle, data.LittrePrice, data.LittreQuantity,
               data.TotalAmount, data.Description]);
        title = data.MissionCardCoupon
      });
      prepare_to_excel.push(tem);
    this.missionCardCoupon.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.ForMissionStartDateGMT.toDateString());
      tempObj.push(e.ForMissionEndDateGMT.toDateString());
      tempObj.push(e.DriverName);
      tempObj.push(e.CarName);
      tempObj.push(e.PricePerL);
      tempObj.push(e.QuantityL);
      tempObj.push(e.TotalPrice);
      tempObj.push(e.Description);
      prepare_to_excel.push(tempObj);
    });
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.writeFile(workbook, title+ '.xls', { bookType: 'xls', type: 'buffer' }); 
  }
}
