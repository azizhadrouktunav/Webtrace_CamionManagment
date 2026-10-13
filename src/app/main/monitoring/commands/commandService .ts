import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, EMPTY, interval, Observable, Subject } from 'rxjs';
import { filter, isEmpty, map, takeUntil, takeWhile, delay , flatMap, repeatWhen, take, find } from 'rxjs/operators';
import { json2array } from 'app/main/helpers/must-match.validator';
import { isUndefined } from 'lodash';
import { FuseUtils } from '@fuse/utils';
import * as _ from 'lodash';
import { element } from 'protractor';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
@Injectable({
  providedIn: 'root'
})
export class CommandService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //IdCommands : BehaviorSubject<any>;
  onCommandsChanged : BehaviorSubject<any>;
  commands : any;
  sessionId = [];
  commandIds = [];
  data = {SessionId: localStorage.getItem('SessionId'),
  };
  private GeneralURL = environment.apiUrl + '/TrackingPageWCFService.svc';
  private GeneralURL1 = environment.apiUrl + '/CommandWCFService.svc';

  constructor(private http: HttpClient,
              private _matSnackBar: MatSnackBar,
              private _router : Router,
              private _errorHandler: ErrorHandlerService) { 
  
    this.onCommandsChanged = new BehaviorSubject([]);
  }
  // getIdCommands() : number[]{
  //  return this.IdCommands.value;
  // }
  // getCommId(key){
  //   let dataStruct = {
  //     SessionId: localStorage.getItem('SessionId'),
  //     keyTrackingObject: key
  //   }
  //   return this.http.post(`${this.GeneralURL}/SendCommandeGetCurrentPosition`, JSON.stringify(dataStruct), this.httpOptions);
  // }

  // CompileComm(CommId){
  //   let dataStruct = {
  //     SessionId: localStorage.getItem('SessionId'),
  //     IdCommands: CommId
  //   }
  //   return this.http.post(`${this.GeneralURL1}/GetAddedOrChangedCommand`, JSON.stringify(dataStruct), this.httpOptions);
  // }
  //SendCommandeGetCurrentPosition
  sendCommandeGetCurrentPosition(keyTrackingObject : number) {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["keyTrackingObject"] = keyTrackingObject.toString();
     this.http.post(`${this.GeneralURL}/SendCommandeGetCurrentPosition`, params , this.httpOptions)
     .subscribe((response : any) => {
       if(response.SendCommandeGetCurrentPositionResult == true){
         this.getAddedOrChangedCommand()
       }
     },
     (err: HttpErrorResponse) => {
        //this.errorHandler.handleError(error);.handleError(err);  
      }
    )
  }
  onDestroy(): void {
   this.onCommandsChanged.closed=true;
   this.onCommandsChanged=null;
   this.onCommandsChanged= new BehaviorSubject([]);
   //= new BehaviorSubject([]);
    //console.log("destroy", this.trackingObjects)
}
  addedOrChangedCommand(commandIds?: number[]): Observable<any>{
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["IdCommands"] = commandIds;
   return this.http.post(`${this.GeneralURL1}/GetAddedOrChangedCommand`, params , this.httpOptions)
  }
  // GetAddedOrChangedCommand
  // just call this function 
  getAddedOrChangedCommand(): void{

    this.addedOrChangedCommand(this.commandIds).pipe(
      repeatWhen(obs =>
       obs.pipe(delay(15000))),
      filter(data => this.CommandStatus(data)),
      take(1)
    )
    .subscribe(data => {
      // subscribe when condition = true
     
      })
  }
  CommandStatus(data:any) : boolean{
    this.commandIds.length = 0;
    var commandsDiff : Command[];
    commandsDiff = this.onCommandsChanged.value;

    if(data){
      this.commands =  json2array(data);
       this.commands = this.commands.map(item => {
          if(item.StatusCommand == 0) {
            this.commandIds.push(item.key);
          }        
          return new Command(item);
        });
        if(commandsDiff.length != 0) {
          this.commands.forEach(function(item){
            let findIndexInArr2 = commandsDiff.findIndex(function(elem){
               return item.key === elem.key;
            })
            if(findIndexInArr2 !== -1){
                commandsDiff[findIndexInArr2] = item;
            }
            else {
              commandsDiff.push(item);
            }
          });
          this.onCommandsChanged.next(commandsDiff);
        }   
        else if(commandsDiff.length == 0) {
          this.onCommandsChanged.next(this.commands);
        }
        //this.IdCommands.next(this.commandIds);
        
      }
      // 0 waiting || 2 timeout || 1 success
      var command =  this.commands.find(it => it.StatusCommand == 0);
            return isUndefined(command);
           
  }
  tryToChangeArming(equipment: string, enable: boolean = false) {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["Equipment"] = equipment;
    params["Enable"] = enable;
    this.http.post(`${this.GeneralURL1}/TryToChangeArming`, params , this.httpOptions).subscribe(data => {
    this.getAddedOrChangedCommand();
   },
   (err: HttpErrorResponse) => {
    //this.errorHandler.handleError(error);.handleError(err);  
    });
  }

  tryToChangeForcedArming(equipment: string, enable: boolean = false) {
    let params = {};
    params["SessionId"] = localStorage.getItem('SessionId');
    params["Equipment"] = equipment;
    params["Enable"] = enable;
    this.http.post(`${this.GeneralURL1}/TryToChangeForcedArming`, params , this.httpOptions).subscribe(data => {
    this.getAddedOrChangedCommand();
   },
   (err: HttpErrorResponse) => {
    //this.errorHandler.handleError(error);.handleError(err);  
  }
)}
}

export class Command {
  key : number;
  DateCommandString : string;
  Fleet: string;
  CommandDescription : string;
  StatusCommandString: string;
  StatusCommand : number;
  IdTrackingObject : number;
 constructor(data?) {
   data = data || {};
   this.CommandDescription =  data.CommandDescription;
   this.DateCommandString  =  data.DateCommandString;
   this.Fleet  = data.Fleet;
   this.IdTrackingObject = data.IdTrackingObject;
   this.StatusCommand  = data.StatusCommand;
   this.StatusCommandString = data.StatusCommandString;
   this.key = data.key;
 }
}