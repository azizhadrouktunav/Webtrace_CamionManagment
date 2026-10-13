import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAlertString } from 'app/main/administration/smsmailconfig/configuration/Alert';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { convertToJSONDate } from 'app/main/helpers/convertToJSONDate';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  
  private REST_API_SERVER = environment.apiUrl
  // Http Header
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
   /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
  constructor(private _httpClient : HttpClient) {

  }
  // GetAlertsElementCompressed

getAlerts(commonAlert: number, keyTrackingObject: number, startDateTimeGMT: Date,endDateTimeGMT: Date) {
  
  let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["commonAlert"] = commonAlert;
      params["keyTrackingObject"] = keyTrackingObject;
      params["startDateTimeGMT"] = convertToJSONDate(startDateTimeGMT);
      params["endDateTimeGMT"] = convertToJSONDate(endDateTimeGMT);

      return this._httpClient.post(this.REST_API_SERVER+ '/TrackingPageWCFService.svc/GetAlertsElementCompressed', params , this.httpOptions);
}
}
