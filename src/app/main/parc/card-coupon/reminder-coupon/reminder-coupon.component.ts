import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Validators_ } from 'app/main/helpers/validators/validators';
import { recurringMode, days } from '../../maintenance/department';
import { CardCouponService } from '../card-coupon.service';
import { CardCoupon } from '../model';


@Component({
  selector: 'app-reminder-coupon',
  templateUrl: './reminder-coupon.component.html',
  styleUrls: ['./reminder-coupon.component.scss']
})
export class ReminderCouponComponent implements OnInit {
  reminderCoupon : FormGroup;
  //dialogTitle: string = 'Add/Update reminder';
  recurringMode = recurringMode;
  days = days;
  driver:string;
  Id:number;
  driverId: number;
  showDays: boolean = false;
  showNDayMonthYear: boolean = true;
  showReminderBy : boolean = true;
  IsCard : boolean
  //label changed
  isRecuringByPriceWhenIsCoupon: boolean = true;
  label : string = 'TotalAmount';
  action="";
  cardCoupon: CardCoupon;
  constructor(
    public matDialogRef: MatDialogRef<ReminderCouponComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private cardCouponService: CardCouponService,
    private _translate : TranslateService
  ) {
       //this.driver = _data.driver;
      // this.Id = _data.Id;
       //this.driverId = _data.driverId;
       //this.IsCard = _data.IsCard;
       this.cardCoupon = _data.cardCoupon;
       this.reminderCoupon = this.createReminderCoupon();
    }

  ngOnInit() {
   // this.onChanges();
  }
  createReminderCoupon() : FormGroup
  {
    return new FormGroup({
      BeginStartRecurringDateGMT : new FormControl(new Date(), Validators.required),
      CardId : new FormControl(this.cardCoupon.Id),
      DriverElementId: new FormControl(this.cardCoupon.Driver),
      EnableGenerateAlert : new FormControl(this.cardCoupon.EnableAlert),
      EnabledDayOfWeekes : new FormControl([1]),
      IsRecuringByPriceWhenIsCoupon: new FormControl(this.isRecuringByPriceWhenIsCoupon),
      RecuringFrequencyNYearMonthWeekDay : new FormControl(1),
      RecurringMode : new FormControl(3, Validators.required),
      RecurringQuantityInLOrPriceWhenIsCoupon : new FormControl(this.cardCoupon.TotalPrice ,[Validators.required ,Validators_.positiveNumberValidator()]),
      WarnMeBeforeNDay : new FormControl(1, Validators.required),
      IsCard : new FormControl(this.cardCoupon.IsCard)
    })
  }
  changed(e){
    
   
    var mode = this.reminderCoupon.get('RecurringMode').value
    this.reminderCoupon.get('RecurringMode').setValue(e.value);
    if(mode == 2){
      this.showDays = true;
    }
    else{
      this.showDays = false;
    }
    if(mode == 5){
      this.showNDayMonthYear = false;
    }
    else {
      this.showNDayMonthYear = true;
    }
  }
  changedDays(e){
    
      
      this.reminderCoupon.get('EnabledDayOfWeekes').setValue(e.value);
  }
  radioChange(e){
       
         this.showReminderBy = JSON.parse(e.value)
  }
  changeIsRecuringByPriceWhenIsCoupon(e){
   
    if(e.value == 'true'){
      this.label = 'TotalAmount';
      // this._translate.get('TotalAmount').subscribe(data => {
      //   this.label = data;
      // });
      this.isRecuringByPriceWhenIsCoupon = true;
    }
    else{
      this.label = 'LittreQuantity';
      // this._translate.get('LittreQuantity').subscribe(data => {
      //   this.label = data;
      // });
      this.isRecuringByPriceWhenIsCoupon = false;
    }
  }
  getErrorMessage(control: string) {
    return this.reminderCoupon.controls[control].hasError('required') ? 'You must enter a value' :
        this.reminderCoupon.controls[control].hasError('nonPositive') ? 'The number should be greater than 0!' :'';
  }
}
