import { Component, OnInit, Inject , ViewEncapsulation} from '@angular/core';
import { CardCouponService } from '../card-coupon.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { CardCoupon } from '../model';

@Component({
  selector: 'app-affect-coupon-form',
  templateUrl: './affect-coupon-form.component.html',
  styleUrls: ['./affect-coupon-form.component.scss']
})
export class AffectCouponFormComponent {
  //action: string;
  dialogTitle: string = "Affect card or coupon to driver";
  drivers: any[];
  vehicles: any[];
  IdCoupon: number;
  cardCoupon: CardCoupon;
  affectCouponForm: FormGroup
  constructor(
              public matDialogRef: MatDialogRef<AffectCouponFormComponent>,
              private _formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) private _data: any) {
    this.IdCoupon = _data.Id
    //this.cardCouponService.getCardCouponManagementParam()
    
    this.drivers = _data.drivers;
    this.vehicles = _data.vehicles;
    this.cardCoupon = _data.cardCoupon;
    this.affectCouponForm = this.createForm()
   }
  public confirmDialog(): void {
    
    this.matDialogRef.close(this.affectCouponForm.value);
         }
  createForm() : FormGroup 
  {
    return new FormGroup({
      idDriver : new FormControl(this.cardCoupon.Driver , Validators.required),
      idUsedCar : new FormControl(this.cardCoupon.Car , Validators.required),
      PricePerL: new FormControl(this.cardCoupon.PricePerL),
      Description: new FormControl(''),
      Period : this._formBuilder.group({
        ForMissionEndDateGMT: new FormControl(new Date(), [Validators.required]),
        ForMissionStartDateGMT: new FormControl(new Date(), [Validators.required]),
      }),
      Tank: new FormControl(null),

    })
  }

}
