import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { showSnackBar } from 'app/main/helpers/validators/validators';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Shape, Value } from './model';

@Injectable()
export class PlacesGeometricShapesManagementService {
  
  polygons : Shape[];
  ways : any [];
  onPolygonsChanged : BehaviorSubject<any>;
  onWaysChanged : BehaviorSubject<any>;
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
    constructor(private _httpClient: HttpClient, 
                private _errorHandler : ErrorHandlerService,
                private _matSnackBar: MatSnackBar)
   { 
      // Set the defaults
      this.onPolygonsChanged = new BehaviorSubject(null);
      this.onWaysChanged = new BehaviorSubject(null);
   }
   /** Operations for polygons **/
   // GetAllPolygon
    getPolygons() : Promise<Shape[]>{
      let params = {};
      params["SessionID"] = localStorage.getItem('SessionId');
       return new Promise((resolve, reject) => {
           this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/GetAllPolygon', params , this.httpOptions)
            .subscribe((response : any) => {
              this.polygons = response.GetAllPolygonResult;
              this.onPolygonsChanged.next(this.polygons);
              resolve(this.polygons);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
             // console.log (error.name + ' ' + error.message);
            }, reject)
        })
    }
    // getAllAsFormArray(): Observable<FormArray>{
    //   return this.getPolygons().pipe(map((polygons: Shape[]) => {
    //     // Maps all the polygons into a formgroup defined in model.ts
    //     const fgs = polygons.map(Shape.asFormGroup);
    //        return new FormArray(fgs);
    //   }));
    // }

     // add Shape
     addPolygon(listPoint: any, name: string, added:boolean = true) {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["ListPoint"] = listPoint;
      params["PolygonName"] = name;
      params["Visible"] = false;
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/AddPolygon', params , this.httpOptions)
            .subscribe((response : any) => {
              if(response.AddPolygonResult != null) {
                    if(added) {
                      var newPolygon = new Shape({Key: response.AddPolygonResult.Key, Value:  response.AddPolygonResult});
                      this.polygons.unshift(newPolygon);
                      this.onPolygonsChanged.next(this.polygons);
                    }
                // Show the successfull message
                showSnackBar('Le plygone a été ajoutée avec succès.', this._matSnackBar);
              }
              else {
                // Show the failure message
                showSnackBar('Veuillez réessayer .', this._matSnackBar)
           }
              resolve(this.polygons);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
              //console.log (error.name + ' ' + error.message);
            }, reject)
        })
     }
    // DeletePolygon
    deletePolygon(key) : Promise<any> {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["KeyPolygon"] = key;
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/DeletePolygon', params , this.httpOptions)
            .subscribe((response : any) => {
              if(response.DeletePolygonResult) {
                const polygonIndex = this.polygons.indexOf(this.polygons.find(item => item.Value.Key == key));
                this.polygons.splice(polygonIndex, 1);
                this.onPolygonsChanged.next(this.polygons);
                 // Show the successfull message
                 showSnackBar('Le plygone a été supprimé avec succès', this._matSnackBar)
              }
              else {
                // Show the failure message
              this._matSnackBar.open('Veuillez réessayer .', 'OK', {
              // here specify the position
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              duration        : 2000
              });
           }
              resolve(response);
            },
            (error: HttpErrorResponse) => {
             //this.errorHandler.handleError(error);.handleError(error);
            }, reject)
        })
    }
    // update Shape
    updatePolygon(polygonId: number, name: string, index: number, latlngs : L.LatLng[]) : Promise<any> {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["KeyPolygon"] = polygonId.toString();
      params["Name"] = name;
      params["ListPoint"] = latlngs;
      params["Visible"] = true;
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/UpdatePolygonNew', params , this.httpOptions)
            .subscribe((response : any) => {
              if(response.UpdatePolygonResult.Id === polygonId) {
                // const polygonIndex = this.polygons.indexOf(
                //   this.polygons.find(it => it.Key == polygonId.toString())
                // );
                this.polygons[index].Value = new Value(response.UpdatePolygonResult);
                this.onPolygonsChanged.next(this.polygons);
                // Show the successfull message
                showSnackBar('Le plygone a été modifié avec succès.', this._matSnackBar);
              }
              else {
                // Show the failure message
                showSnackBar('Veuillez réessayer .', this._matSnackBar)
           }
              resolve(this.polygons);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
            }, reject)
        })
    }
    /** Operations for ways **/
    getWays() : Promise<any>{
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/GetAllWay', params , this.httpOptions)
            .subscribe((response : any) => {
              this.ways = response.GetAllWayResult;
              this.onWaysChanged.next(this.ways);
              resolve(this.ways);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
            }, reject)
        })
    }

    // update way
    updateWay(name: string , key, index:number) {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["Key"] = key;
      params["Name"] = name;
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/UpdateWayName', params , this.httpOptions)
            .subscribe((response : any) => {
              if(response.UpdateWayNameResult.Key === key) {
              // const newWay = this.ways.find((item) => {
              //     return item.Key == response.UpdateWayNameResult.Key;
              // });
              // const wayIndex = this.ways.indexOf(newWay);
                this.ways[index].Value = response.UpdateWayNameResult;
                this.onWaysChanged.next(this.ways);
                // Show the successful message
                showSnackBar('Iténiraire est mis à jour avec succès' , this._matSnackBar);
              }
              else {
              // Show the failure message
              showSnackBar('Veuillez réessayer .', this._matSnackBar);
           }
              resolve(this.ways);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
            }, reject)
        })
    }
    // delete way
    deleteWay(way) : Promise<any> {
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["Key"] = way.Key;
        return new Promise((resolve, reject) => {
          this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/DeleteWay', params , this.httpOptions)
            .subscribe((response : any) => {
              if(response.DeleteWayResult == true) {
                const wayIndex = this.ways.indexOf(way);
                this.ways.splice(wayIndex, 1);
                this.onWaysChanged.next(this.ways);
                   // Show the successfull message
                showSnackBar('Le chemin est supprimé avec succès.' , this._matSnackBar)
              }
              else {
              // Show the failure message
              showSnackBar('Veuillez réessayer .', this._matSnackBar);
           }
              resolve(response.DeleteWayResult);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
              //console.log (error.name + ' ' + error.message);
            }, reject)
        })
    }

    addWay(name: string, arrayLatLong, added: boolean = true) : Promise<any> {
        //arrayLatLong: number[], wayName: string
      let params = {};
      params["SessionId"] = localStorage.getItem('SessionId');
      params["ArrayLatLong"] = arrayLatLong;
      params["Visible"] = true;
      params["WayName"] = name;
      return new Promise((resolve, reject) => {
        this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/AddWay', params , this.httpOptions)
            .subscribe((response: any) => {
              if(response.AddWayResult != null)
              {  
                if(added) {
                  this.ways.unshift( new Shape({ key: response.AddWayResult.Key, Value :response.AddWayResult}));
                  this.onWaysChanged.next(this.ways);
                }
                showSnackBar("L'iténiraire "+response.AddWayResult.Name + " est ajoutée.", this._matSnackBar);
              }
                resolve(response);
            },
            (error: HttpErrorResponse) => {
              //this.errorHandler.handleError(error);.handleError(error);
              //console.log (error.name + ' ' + error.message);
            },reject);
    });
    }

}
