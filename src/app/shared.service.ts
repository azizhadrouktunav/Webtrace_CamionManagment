
import { AnimationStyleMetadata } from '@angular/animations';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class SharedService {

  private params = new BehaviorSubject({});

  constructor() {}

  fetchParams(): Observable<any> {
    return this.params.asObservable();
  }

  sendParams(navigation: any) {
    this.params.next({navigation: navigation });
  }
clear() {
  this.params.next(null);
    }
}