import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { GeneralCost, ListCostAndDetails, ListTypeSelected } from '../interfaces/depenses-general';
@Injectable({
  providedIn: 'root'
})
export class DepensesGeneralService {

    GetDepensesUrl = environment.apiUrl + '/GeneralCostWCFServiceNtSoft.svc/GetGeneralCostParamSession';
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
    SessionId = [];
    StartDateGMT: Date;
    EndDateGMT: Date;
    ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri: ListTypeSelected[];
    Type: number;
   

    constructor(private http: HttpClient) { }
    getData(): Observable<GeneralCost> {
       let data = {
            SessionId: localStorage.getItem('SessionId')
        };
        return this.http.post<GeneralCost>(this.GetDepensesUrl, JSON.stringify(data), this.httpOptions);
    }

    GetObjListCostAndDetails(StartDateGMT: Date, EndDateGMT: Date, Type: number, ListTypeSelected: ListTypeSelected[]): Observable<ListCostAndDetails> {
       
        let GetObjListCostAndDetailsUrl =  environment.apiUrl + '/GeneralCostWCFServiceNtSoft.svc/GetObjListCostAndDetails';
        let data2 = {
            SessionId: localStorage.getItem('SessionId'),
            StartDateGMT: '/Date(' + StartDateGMT.getTime() + ')/',
            EndDateGMT: '/Date(' + EndDateGMT.getTime() + ')/',
            ListFourOrCatgOrMdlOrCmpOrTTOrDepOrDri: ListTypeSelected,
            Type: Type
        };
        return this.http.post<ListCostAndDetails>(GetObjListCostAndDetailsUrl, JSON.stringify(data2), this.httpOptions);

    }
    errorHandler(error: HttpErrorResponse) {
        // tslint:disable-next-line: deprecation
        return Observable.throw(error.message || 'Server Error');
    }
}
