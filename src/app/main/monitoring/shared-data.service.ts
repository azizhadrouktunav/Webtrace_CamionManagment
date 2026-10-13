import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class SharedDataService {

  private indexSource : BehaviorSubject<number> = new BehaviorSubject(null);
  $firstServiceResponseSource:  BehaviorSubject<number> = new BehaviorSubject(null);
  $secondServiceResponseSource:  BehaviorSubject<number> = new BehaviorSubject(null);
  $thirdServiceResponseSource: BehaviorSubject<number> = new BehaviorSubject(null);
 // $carServiceResponse: BehaviorSubject<number> = new BehaviorSubject(null);
  private trackingObjectSource: BehaviorSubject<number> = new BehaviorSubject(null);
  private matriculeAlertSource: BehaviorSubject<number> = new BehaviorSubject(null);
  currentIndex = this.indexSource.asObservable();
  private params = new BehaviorSubject({});
  private paramsMap = new BehaviorSubject({});


  get firstServiceResponse(): Observable<number>
    {
        return this.$firstServiceResponseSource.asObservable();
    }

    setFirstServiceResponse(value: number): void
    {
        this.$firstServiceResponseSource.next(value);
    }

    get secondServiceResponse(): Observable<number>
    {
        return this.$secondServiceResponseSource.asObservable();
    }

    setSecondServiceResponse(value: number): void
    {
        this.$secondServiceResponseSource.next(value);
    }


    get thirdServiceResponse(): Observable<any>
    {
        return this.$thirdServiceResponseSource.asObservable();
    }

    setThirdServiceResponse(value: any): void
    {
        this.$thirdServiceResponseSource.next(value);
    }
   /* get carServiceResponse(): Observable<number>
    {
        return this.$carServiceResponse.asObservable();
    }

    setcarServiceResponse(value: any): void
    {
        this.$carServiceResponse.next(value);
    }
*/
currentTrackingObject = this.trackingObjectSource.asObservable();

  // Observable string streams
currentMatriculeAlert = this.matriculeAlertSource.asObservable();
  constructor() { }

  changeIndex(index: number) {
    this.indexSource.next(index);
  }
  changeTrackingObject(trackingObject: number) {
    this.trackingObjectSource.next(trackingObject);
  }

  changeSettingsAlert(trackingObject: number) {
     return new Promise<void>((resolve, reject) => {
         this.matriculeAlertSource.next(trackingObject);
         resolve();
     });
  }

  fetchMapConf(): Observable<any> {
    return this.paramsMap.asObservable();
  }

  sendTO(param1: any) {
    this.params.next({param1: param1 });
  }

  fetchTO(): Observable<any> {
    return this.params.asObservable();
  }

  sendMapConf(param1: any) {
    this.paramsMap.next({param1: param1 });
  }
}
