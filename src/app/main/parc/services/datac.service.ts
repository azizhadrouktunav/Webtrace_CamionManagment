import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DatacService {

  private params = new BehaviorSubject({});

  constructor() {}

  fetchParams(): Observable<any> {
    return this.params.asObservable();
  }

  sendParams(trackingObject: number, BCIid: number) {
    this.params.next({trackingObject: trackingObject, BCIid: BCIid});
  }

}