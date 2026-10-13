
import { CardCoupon, SupplierFuelEnum } from '../model';
import { CardCouponService } from '../card-coupon.service';
import { json2array } from 'app/main/helpers/must-match.validator';;
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-card-coupon-form',
  templateUrl: './card-coupon-form.component.html',
  styleUrls: ['./card-coupon-form.component.scss']
})
export class CardCouponFormComponent implements OnInit {

  action: string;
  dialogTitle: string;
  cardCoupon: CardCoupon;
  cardCouponForm: FormGroup
  suppliers = SupplierFuelEnum;
  departments : any[] = [];
  label : string = '';
  labelQteOrAmount : string = '';
  reference : string = '';
  constructor(
    public matDialogRef: MatDialogRef<CardCouponFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private cardCouponService: CardCouponService,
    private _translate : TranslateService) {
      this.cardCoupon = _data.cardCoupon
      this.action = _data.action
      this.departments = this.cardCouponService.getDepartments()
      if ( this.action === 'edit' )
      {
          this.dialogTitle = 'EditCardCoupon';
      }
      else
      {
          this.dialogTitle = 'AddCardCoupon';
          this.cardCoupon = new CardCoupon()
      }
  this.cardCouponForm = this.createCardCouponForm()
    }
    ngOnInit() : void{
     if(this.action === 'edit') {
       this.cardCouponForm.get('to').setValidators(Validators.required);
       this.cardCouponForm.get('from').setValidators(Validators.required);
     }
     if(this.cardCoupon.IsCard){
        this._translate.get('ThisCardCanBeRenewed').subscribe(data => {
        this.label = data;
        });
      }
      else if(!this.cardCoupon.IsCard){
        this._translate.get('msgChargingThisCouponIsDone').subscribe(data => {
            this.label = data;
        });
     }
     if(this.cardCoupon.IsCardCouponWorkByMoney){
      this._translate.get('TotalAmount').subscribe(data => {
        this.labelQteOrAmount = data;
      });
      this.cardCouponForm.get('QuantityLOrTotalPrice').patchValue(this.cardCoupon.TotalPrice);
     }
     else if(!this.cardCoupon.IsCardCouponWorkByMoney) {
      this.cardCouponForm.get('QuantityLOrTotalPrice').patchValue(this.cardCoupon.QuantityL);
      this._translate.get('LittreQuantity').subscribe(data => {
        this.labelQteOrAmount = data;
      });
     }
    this.onChanges();
    //this.cardCouponForm.get('from').setValidators(Validators.min(this.cardCouponForm.get('to').value));
     }  
// -----------------------------------------------------------------------------------------------------
// @ Public methods
// -----------------------------------------------------------------------------------------------------
 createCardCouponForm() : FormGroup
 { 
   
   return  this._formBuilder.group({
    Id : new FormControl(this.cardCoupon.Id),
    IsCard : new FormControl(this.cardCoupon.IsCard), //Type
    ref : new FormControl(),
    to : new FormControl(0, null),
    from : new FormControl(0, [this.lowerThan('to')]),
    CardCouponRef_ : new FormControl(this.cardCoupon.CardCouponRef),
    DateCardCouponLocal : new FormControl(this.cardCoupon.DateCardCouponLocal ),
    SupplierFuel: new FormControl(this.cardCoupon.SupplierFuel, Validators.required),
    Department : new FormControl(this.cardCoupon.Department, Validators.required),
    IsCardCouponWorkByMoney : new FormControl(this.cardCoupon.IsCardCouponWorkByMoney),
    PricePerL : new FormControl(this.cardCoupon.PricePerL, [Validators.required,Validators_.positiveNumberValidator()]),
    QuantityLOrTotalPrice : new FormControl(this.cardCoupon.QuantityL, [Validators.required,Validators_.positiveNumberValidator()]),
    QuantityL : new FormControl(this.cardCoupon.QuantityL ),
    TotalPrice: new FormControl(this.cardCoupon.TotalPrice )
   })
 }
 onChanges(): void {

     this.cardCouponForm.get('ref').valueChanges.subscribe(data => {
       this.reference = data;
     });
     this.cardCouponForm.get('IsCardCouponWorkByMoney').valueChanges.subscribe(val => {
       if(val){
       this._translate.get('TotalAmount').subscribe(data => {
         this.labelQteOrAmount = data;
       });
       this.cardCouponForm.get('QuantityLOrTotalPrice').patchValue(this.cardCoupon.TotalPrice);
      }
      else {
        this.cardCouponForm.get('QuantityLOrTotalPrice').patchValue(this.cardCoupon.QuantityL);
        this._translate.get('LittreQuantity').subscribe(data => {
          this.labelQteOrAmount = data;
        });
      }
     });
  }
  changeType(e) {
    if(e.value){
      this._translate.get('ThisCardCanBeRenewed').subscribe(data => {
      this.label = data;
      });
    }
    else {
      this._translate.get('msgChargingThisCouponIsDone').subscribe(data => {
          this.label = data;
      });
    }
  }
  lowerThan(field_name): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } => {

      const input = control.value;

      const isLower = control.root.value[field_name] >= input;

      return isLower ? {'lowerThan': {isLower}}: null;
    };
  }
  getErrorMessage(control: string) {
    return this.cardCouponForm.controls[control].hasError('required') ? 'You must enter a value' :
        this.cardCouponForm.controls[control].hasError('nonPositive') ? 'The number should be greater than 0' :'';
  }
}
