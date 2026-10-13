import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { environment } from 'environments/environment';
import { isUndefined } from 'lodash';

    export class Point {
        GeometricShape: number;
        GeometricShapeOrder: number;
        Id: number;
        Latitude: number;
        Longitude: number;
        X: number;
        Y: number;
        constructor(data) {
            data = data || {};
            this.Id = data.Id;
            this.GeometricShape = data.GeometricShape;
            this.GeometricShapeOrder = data.GeometricShapeOrder;
            this.Latitude = data.Latitude;
            this.Longitude= data.Longitude;
            this.X = data.X;
            this.Y = data.Y;
        }
    }

    export class Value {
        Account: number;
        ArgbLineColor: number;
        ExternalId: number;
        ExternalId2: number;
        Id: number;
        Key: string;
        LineWidth: number;
        Name: string;
        Points: Point[];
        m_Account: number;
        m_id: number;
        AreaWidth: number;
        ArgbAreaColor: number;
        PolygonTypeEnum: number;
        Type: string;
        m_Type: string;
        constructor(data) {
          data = data || {};
          this.Id = data.Id;
          this.Account = data.Account;
          this.ArgbLineColor = data.ArgbLineColor;
          this.ExternalId = data.ExternalId;
          this.ExternalId2 = data.ExternalId2;
          this.Key = data.Key;
          this.LineWidth = data.LineWidth;
          this.Name = data.Name || '';
          this.Points = data.Points;
          this.m_Account = data.m_Account;
          this.m_id = data.m_id;
          this.AreaWidth= data.AreaWidth; 
          this.ArgbAreaColor = data.ArgbAreaColor;
          this.PolygonTypeEnum = data.PolygonTypeEnum;
          this.Type = data.Type;
          this.m_Type = data.m_Type; 
        }
    }
  /* way also*/
    export class Shape {
        Key: string;
        Value: Value;

        static asFormGroup(polygon: Shape): FormGroup {
            const fg = new FormGroup({
              name: new FormControl(polygon.Value.Name, [Validators.required]),
              key : new FormControl(polygon.Key, Validators.required)
            });
            return fg;
          }
      constructor(data) {
        data = data || {};
        this.Key = data.Key ;
        this.Value = new Value({});
      }
    }
    export function ValidateName(data : any[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
          const error: ValidationErrors = { validname: true };
      
          const polygonIndex = data.indexOf(control);
            data.splice(polygonIndex, 1);
            const obj =  data.filter(it => {
                    it.Value.Name == control.value;
           });
          if(control.value && !isUndefined(obj)) {
                         control.setErrors(error);
                      return error;
           }
          control.setErrors(null);
          return null;
        };
      }
      export class Place {
        Id: number;
        AccountId: number;
        AccountName: string;
        CanChangePlaceAccess: boolean;
        Description: string;
        MediumIconName: string;
        NamePlace: string;
        PlaceAccessType : number;
        PlaceAccessTypeString: string;
        Point :Point;
        m_icon: Icon;
        visible: boolean;
        show : boolean;
        constructor(data){
          data = data || {}
          this.Id = data.Id;
          this.AccountId = data.AccountId;
          this.AccountName = data.AccountName;
          this.CanChangePlaceAccess = data.CanChangePlaceAccess;
          this.Description = data.Description;
          this.MediumIconName = data.MediumIconName || 'pin-cyan-32x32';
          this.NamePlace = data.NamePlace;
          this.PlaceAccessType= data.PlaceAccessType || 1;
          this.PlaceAccessTypeString = data.PlaceAccessTypeString;
          this.Point = new Point(data.Point);
          this.m_icon = new Icon(data.m_icon);
          this.visible = data.visible;
        }
      }
      export class Icon {
        MediumName: string;
        MediumNameWith_: string;
        SmallName: string;
        SmallNameWith_: string;
        m_MediumName: string;
        m_MediumNameWith_: string;
        m_SmallName: string;
        m_SmallNameWith_: string
        constructor(data) {
          data = data || {};
          this.MediumName = environment.iconUrl+'images/places/'+data.MediumName+'.png';
          this.MediumNameWith_ = environment.iconUrl+'images/places/'+data.MediumNameWith_+'.png';
          this.SmallName = environment.iconUrl+'images/places/'+data.SmallName+'.png';
          this.SmallNameWith_ = environment.iconUrl+'images/places/'+data.SmallNameWith_+'.png';
          this.m_MediumName = environment.iconUrl+'images/places/'+data.m_MediumName+'.png';
          this.m_MediumNameWith_ = environment.iconUrl+'images/places/'+data.m_MediumNameWith_+'.png';
          this.m_SmallName = environment.iconUrl+'images/places/'+data.m_SmallName+'.png';
          this.m_SmallNameWith_ = environment.iconUrl+'images/places/'+data.m_SmallNameWith_+'.png';

        }
    }
// To validate first name
// export function ValidatePolyName(control: AbstractControl, data : any[]) :{
//     const polygonIndex = data.indexOf(control);
//     this.dataSource.data.splice(polygonIndex, 1);
//    const obj =  data.filter(it => {
//           it.name == control.value;
//     });
//     if(!isUndefined(obj)) {
//         return { validname: true };
//     }
//     return null;
//   }
    export interface RootObject {
        GetAllPolygonResult: Shape[];
    }


