import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { showSnackBar } from 'app/main/helpers/showSnackBar';
import { environment } from 'environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { TrackingObjectService } from '../../tracking/tracking-objects.service';
import { Place } from '../model';
import { takeUntil } from 'rxjs/operators';
import { promise } from 'protractor';

@Injectable()
export class PlacesService {

  private REST_API_SERVER = environment.apiUrl
  private _unsubscribeAll: Subject<any>;
  // Http Header
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
 //selectedPlaces: Place[] = [];
 places: Place[];
 //onSelectedPlacesChanged: BehaviorSubject<any>
   /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
  constructor(
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    private _trackingObjectService: TrackingObjectService,
    private _errorHandler: ErrorHandlerService
  ) { 
  //  this.onSelectedPlacesChanged = new BehaviorSubject([]);
  }
   /**
     * Add place
     *
     * @param place
     * @returns {Promise<any>}
     */
    addPlace(place): Promise<any>
    {  
      let params = {};
      params["SessionID"] = localStorage.getItem('SessionId');
      params["Description"] = place.description;
      var icon = place.icon.replace(environment.iconUrl+'images/Places/','').replace('.png', '');
      params["Icon"] = icon;
      params["Latitude"] = place.latitude;
      params["Longitude"] = place.longitude;
      params["PlaceAccessTypeInt"] = place.placeAccessType;
      params["PlaceName"] = place.name;

             return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/AddPlaceByProperty', params , this.httpOptions)
                .subscribe((response: any) => {
                    
                    if(response.AddPlaceByPropertyResult != null) {
                      showSnackBar("Emplacement est ajouté avec succès", this._snackBar);
                      this._trackingObjectService.places.unshift(new Place(response.AddPlaceByPropertyResult));
                      this._trackingObjectService.onPlacesChanged.next(this._trackingObjectService.places);
                    }
                    
                    resolve(response.AddPlaceByPropertyResult);
                },
                (err:  HttpErrorResponse) => {
                    //this.errorHandler.handleError(error);.handleError(err);
                },reject);
        });
    }
     /**
      * edit place
     */
     editPlace(place): Promise<any>
     {
      //let test = this._trackingObjectService.places;
      let params = {};
      params["SessionID"] = localStorage.getItem('SessionId');
      params["Description"] = place.description;
      params["Icon"] = place.icon.replace(environment.iconUrl+'images/places/','').replace('.png', '');
      params["Latitude"] = place.latitude;
      params["Longitude"] = place.longitude;
      params["PlaceAccessTypeInt"] = place.placeAccessType;
      params["PlaceName"] = place.name;
      params["KeyPlace"] = place.id;
             return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/UpdatePlaceByProperty', params , this.httpOptions)
                .subscribe((response: any) => {
                    if(response.UpdatePlaceByPropertyResult != null) {
                      showSnackBar('Emplacement est modifié avec succès  ', this._snackBar);
                      var newPlace: Place = new Place(response.UpdatePlaceByPropertyResult);
                        
                   /*   this._unsubscribeAll = new Subject();
                      this._trackingObjectService.onPlacesChanged
                      .pipe(takeUntil(this._unsubscribeAll))
                      .subscribe(places => {
                          this.places = places;
                        
                      });*/

                      var index = this._trackingObjectService.places.indexOf(this._trackingObjectService.places.find(it => it.Id === newPlace.Id));

                       this._trackingObjectService.places[index] = newPlace;
                      this._trackingObjectService.onPlacesChanged.next(this._trackingObjectService.places);
                    }   
                    resolve(response);
                },
                (err:  HttpErrorResponse) => {
                  //this.errorHandler.handleError(error);.handleError(err);
                  showSnackBar('Error occurred. Details: ' + err.name + ' ' + err.message, this._snackBar);
                },reject);
        });

     }
      /**
     * Delete place
     *
     * @param place
     * @returns {Promise<any>}
     */
    deletePlace(KeyPlace: number): Promise<any>
    { 
      let params = {};
      params["SessionID"] = localStorage.getItem('SessionId');
      params["KeyPlace"] = KeyPlace;
        return new Promise((resolve, reject) => {
            this._httpClient.post(this.REST_API_SERVER+'/PlacesGeometricShapesManagementWCFService.svc/RemovePlace', params , this.httpOptions)
                .subscribe((response: any) => {
                  if(response.RemovePlaceResult){
                    showSnackBar('Emplacement est supprimé avec succès ', this._snackBar);
                    const  placeIndex = this._trackingObjectService.places.indexOf(this._trackingObjectService.places.find(item => item.Id === KeyPlace));
                    this._trackingObjectService.places.splice(placeIndex, 1);
                    this._trackingObjectService.onPlacesChanged.next(this._trackingObjectService.places);
                  }
                    resolve(response);
                },
                (err:  HttpErrorResponse) => {
                  //this.errorHandler.handleError(error);.handleError(err);
                },reject);
        });
    }
        /**
     * Deselect places
     */
    // deselectPlaces(): void
    // {
    //     this.selectedPlaces = [];

    //     // Trigger the next event
    //     this.onSelectedPlacesChanged.next(this.selectedPlaces);
    // }
     /**
     * Select contacts
     *
     * @param filterParameter
     * @param filterValue
     */
    // selectPlaces(filterParameter?, filterValue?): void
    // {
    //     this.selectedPlaces = [];

    //     // If there is no filter, select all contacts
    //     if ( filterParameter === undefined || filterValue === undefined )
    //     {
    //         this.selectedPlaces = [];
    //         this.places.map(place => {
    //             this.selectedPlaces.push(place);
    //         });
    //     }

    //     // Trigger the next event
    //     this.onSelectedPlacesChanged.next(this.selectedPlaces);
    // }
       /**
     * Toggle selected place
     *
     * @param place
     */
    // toggleSelectedPlaces(place): void
    // {
    //     // First, check if we already have that contact as selected...
    //     if ( this.selectedPlaces.length > 0 )
    //     {
    //         const index = this.selectedPlaces.indexOf(place);

    //         if ( index !== -1 )
    //         {
    //             this.selectedPlaces.splice(index, 1);

    //             // Trigger the next event
    //             this.onSelectedPlacesChanged.next(this.selectedPlaces);

    //             // Return
    //             return;
    //         }
    //     }

    //     // If we don't have it, push as selected
    //     this.selectedPlaces.push(place);

    //     // Trigger the next event
    //     this.onSelectedPlacesChanged.next(this.selectedPlaces);
    // }
     /**
     * Toggle select all
     */
    // toggleSelectAll(): void
    // {
    //     if ( this.selectedPlaces.length > 0 )
    //     {
    //         this.deselectPlaces();
    //     }
    //     else
    //     {
    //         this.selectPlaces();
    //     }
    // }
}
