import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { uniqueValidator } from 'app/main/helpers/validators/uniqueName';
import { GlobalMap } from 'app/main/monitoring/map/map';
import { environment } from 'environments/environment';
import { isUndefined } from 'util';
import { Place } from '../../model';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PlaceFormComponent implements OnInit  {

  Map : GlobalMap = GlobalMap.globalMap;
  action: string;
  place: Place;
  placeForm: FormGroup;
  dialogTitle: string;
  names: string[];
  _uRL = environment.mock ? 'assets/images/logos/' : environment.iconUrl + 'images/places/';
  icons: { name: string, value: string} [] = environment.mock
    ? [
        { name: 'assets/images/logos/fuse.svg', value: 'pin' },
        { name: 'assets/images/logos/fuse.svg', value: 'atelier' },
        { name: 'assets/images/logos/fuse.svg', value: 'pause' }
      ]
    : [
    { name: this._uRL+'pin-cyan-32x32'+'.png', value: 'pin-cyan'},
    { name: this._uRL+'City-32x32'+'.png', value: 'City'},
    { name: this._uRL+'Big-Ben-32x32'+'.png', value: 'Big-Ben'},
    { name: this._uRL+'Colosseum-32x32'+'.png', value: 'Colosseum'},
    { name: this._uRL+'Egypt-Pyramid-32x32'+'.png', value: 'Egypt Pyramid'},
    { name: this._uRL+'New-York-Liberty-32x32'+'.png', value: 'New-York liberty'},
    { name: this._uRL+'Taj-Mahal-32x32'+'.png', value: 'Taj-Mahal'},
    { name: this._uRL+'Tour-Eiffel-32x32'+'.png', value: 'Tour-Eiffel'},
    { name: this._uRL+'bank-32x32'+'.png', value: 'Bank'},
    { name: this._uRL+'Bridge-32x32'+'.png', value: 'Bridge'},
    { name: this._uRL+'cabriolet-32x32'+'.png', value: 'Cabriolet'},
    { name: this._uRL+'societe-32x32'+'.png', value: 'Societe'},
    { name: this._uRL+'Drugstore-32x32'+'.png', value: 'Drugstore'},
    { name: this._uRL+'Factory-32x32'+'.png', value: 'Factory'},
    { name: this._uRL+'Goverment-32x32'+'.png', value: 'Goverment'},
    { name: this._uRL+'Hangar-32x32'+'.png', value: 'Hangar'},
    { name: this._uRL+'Home-32x32'+'.png', value: 'Home'},
    { name: this._uRL+'store-house-32'+'.png', value: 'House'},
    { name: this._uRL+'industrybis-32x32'+'.png', value: 'industry'},
    { name: this._uRL+'Mosquai-32x32'+'.png', value: 'Mosquai'},
    { name: this._uRL+'Museum-32x32'+'.png', value: 'Museum'},
    { name: this._uRL+'Property-32x32'+'.png', value: 'Property'},
    { name: this._uRL+'Retail-Shop-32x32'+'.png', value: 'Retail shop'},
    { name: this._uRL+'School-32x32'+'.png', value: 'School'},
    { name: this._uRL+'Temple-32x32'+'.png', value: 'Temple'},
    { name: this._uRL+'Traditional-Home-32x32'+'.png', value: 'Traditional home'},
    { name: this._uRL+'New-Room-32x32'+'.png', value: 'New-Room'},
    { name: this._uRL+'company--32'+'.png', value: 'Company'}
  ];
  placeAccessTypes : {name: string , value: number}[] = [
    {name: 'PrivatePlaceAccessTypeDescription' , value: 1},
    {name: 'PublicPlaceAccessTypeDescription' , value: 2}
  ];
  marker: any;
  canChangePlaceAccess: boolean;
    /**
     * Constructor
     *
     * @param {MatDialogRef<PlaceFormComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
  constructor(
    public matDialogRef: MatDialogRef<PlaceFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
     // Set the defaults
     this.action = _data.action;
     this.names = _data.names;
     if ( this.action === 'edit' )
     {
         this.dialogTitle = 'Common.EditPlace';
         this.place = _data.place;
        
        
       
     }
     else
     {
         this.dialogTitle = 'Common.AddPlace';
         this.place = new Place({});

     }
     this.canChangePlaceAccess = this.place.CanChangePlaceAccess;
     this.placeForm = this.createPlaceForm();
     if(this.place.CanChangePlaceAccess == false) {
      this.placeForm.get('placeAccessType').disable();
    }
   
   }
   ngOnInit(): void {
    if(this.action === 'new')
    {
    this.marker =   this.Map.drawer.drawPoint(coords => {
        this.placeForm.get('latitude').setValue(coords.lat);
       this.placeForm.get('longitude').setValue(coords.lng);
      });
  
   }
   this.matDialogRef.afterClosed().subscribe(() => {
     if(!isUndefined(this.marker)) {
              this.marker.obj.remove();
     }
  });
  }
  // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create contact form
     *
     * @returns {FormGroup}
     */
    createPlaceForm(): FormGroup
    {
        const defaultIcon = this.icons.length ? this.icons[0].name : '';
        return this._formBuilder.group({
            id      : [this.place.Id],
            name    : [this.place.NamePlace, [uniqueValidator(this.names)]],
            description: [this.place.Description || (environment.mock ? '—' : '')],
            placeAccessType  : [this.place.PlaceAccessType || 1],
            icon: [environment.mock ? defaultIcon : (this.place.m_icon && this.place.m_icon.MediumName) || defaultIcon],
            latitude : [this.place.Point ? this.place.Point.Latitude : null],
            longitude: [this.place.Point ? this.place.Point.Longitude : null]
        });
    }
    getMessageVisibility() : string {

      return 'the only one who is allowed to modify the visibility is '+ this.place.AccountName;
    }
    getMessageDescription() : string {
      return 'for an organized description you can introduce \':\' and \';\' example Code: 21; Num: 71 807 667';
    }

}
