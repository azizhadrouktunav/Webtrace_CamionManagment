import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportService } from '../../services/report.service';
import { Router } from '@angular/router';
import { SharedreportdataService } from '../../services/sharedreportdata.service';
import { AuthenticateService } from 'app/main/authenticate/authenticate.service';import { decrypt } from 'app/main/parc/Parc';
import { json2array } from 'app/main/helpers/must-match.validator';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';

@Component({
  selector: 'app-graphicreportform',
  templateUrl: './graphicreportform.component.html',
  styleUrls: ['./graphicreportform.component.scss']
})
export class GraphicreportformComponent implements OnInit {

  ReportingParam: any;
  trackingObjects: any;
  form: FormGroup;
  fb: any;
  trackingObject: number;
  CarMatricule: any;
  Selected_chauffeur :any;
  stepSecond:any;
  stepMinute:any;
  stepHour:any;
  minDate:any;
  maxDate:any;
  touchUi:any;
  showSpinners:any;
  showSeconds:any;
  color:any;


 dateObj = new Date();noshrink : any;

 constructor(private _ReportService: ReportService,
             private _errorHandler: ErrorHandlerService) { 
      this.form = this.createForm();
  }

  ngOnInit() {

    this._ReportService.getReportingParam().subscribe((result) => {
      
     
      this.trackingObjects = decrypt(result);
      this.ReportingParam = json2array(this.trackingObjects);
      this.trackingObjects = json2array(this.ReportingParam[3]);
      
    },
    (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);
    });  
  }
  createForm(): FormGroup {
    return new FormGroup({
   

        Car: new FormControl(''),
          StartDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),0,0,0)) ,
        EndDateGMT: new FormControl(new Date(this.dateObj.getUTCFullYear(),this.dateObj.getUTCMonth() ,this.dateObj.getUTCDate(),23,59,59)),
                Emplacement: new FormControl(1),
        report: new FormControl(''),
       
    });

    
}
GetReportParam() {
 
 this.trackingObjects.forEach(e=>{
  if(e.Key.toString() == this.form.value.Car){
    this.CarMatricule = e.FullName;
  }
});
 /*this.trackingObject = this.form.value.Car;
 this.documentType = +data.Id;
 this.documentTypeString = +data.DocumentType;
 this._SharedreportdataService.sendParams(this.form.value.Car, this.form.value.StartDateGMT,
  this.form.value.EndDateGMT,this.form.value.Emplacement,0,0,
  0,0,this.form.value.report,this.CarMatricule,[]);
 this.router.navigate([
   "/reports/graphicreport/Details" 
 ]);*/

}
}
