import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";



@Injectable()
export class AlertconfigurationShowedInNotificationService  {

   
    private REST_API_SERVER = environment.apiUrl
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
    constructor(
        private _httpClient: HttpClient,
       
    ) {
        // Set the defaults
       
    }
    onDestroy(): void {
       
        //console.log("destroy", this.trackingObjects)
    }
    
   
    getCommonAlertWithDescriptionShowedInNotificationState()
    {
        
     let params = {};
     params["SessionId"] = localStorage.getItem('SessionId');
    
     return      this._httpClient.post(this.REST_API_SERVER + "/AlertInputOptionManagerWCFService.svc/GetCommonAlertWithDescriptionShowedInNotificationState"
          , JSON.stringify(params), this.httpOptions);         
      // return    this._httpClient.get(this.Fake_API_SERVER+"/Alerts");
    }

    
    updateShowedAlarmInRTCfg(alertConfigs)
    {
        
     let params = {};
     params["SessionId"] = localStorage.getItem('SessionId');
     params["TabHiddenShowedAlert"] = alertConfigs;

     return      this._httpClient.post(this.REST_API_SERVER + "/AlertInputOptionManagerWCFService.svc/UpdateShowedAlarmInRTCfg"
          , JSON.stringify(params), this.httpOptions);         
      // return    this._httpClient.get(this.Fake_API_SERVER+"/Alerts");
    }
}
