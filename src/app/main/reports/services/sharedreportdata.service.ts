import { AnimationStyleMetadata } from '@angular/animations';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedreportdataService {

  private params = new BehaviorSubject({});

  constructor() {}

  fetchParams(): Observable<any> {
    return this.params.asObservable();
  }

  sendParams(param1: any, param2: Date, param3 : Date,
       param4 : any , param5 : any , param6 : number,
       param7 : number , param8 : number , param9 : number , param10 : string,param11 : any[]) {
    this.params.next({param1: param1, param2: param2, param3 : param3,
      param4 : param4 , param5 : param5 , param6 : param6,
      param7 : param7 , param8 : param8 , param9 : param9,  param10 :  param10,param11 : param11 });
  }
clear() {
  this.params.next(null);
    }
}