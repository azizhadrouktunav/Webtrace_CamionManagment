import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class DataService {

  private params = new BehaviorSubject({});

  constructor() {}

  fetchParams(): Observable<any> {
    return this.params.asObservable();
  }

  sendParams(tree ) {
    this.params.next({tree: tree});
  }

}