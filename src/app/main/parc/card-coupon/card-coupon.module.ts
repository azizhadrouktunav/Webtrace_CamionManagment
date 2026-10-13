import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CardCouponComponent } from './card-coupon.component';
import { Routes, RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatTableModule} from '@angular/material/table';
import { CardCouponService } from './card-coupon.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { CardCouponFormComponent } from './card-coupon-form/card-coupon-form.component';
import { AffectCouponFormComponent } from './affect-coupon-form/affect-coupon-form.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { ReminderCouponComponent } from './reminder-coupon/reminder-coupon.component';
import { CardCouponLogComponent } from './card-coupon-log/card-coupon-log.component';
import {MatTabsModule} from '@angular/material/tabs';
import { TankComponent } from '../tank/tank.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { NewTankComponent } from '../tank/new-tank/new-tank.component';
import { MatButtonModule } from '@angular/material/button';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartsModule } from 'ng2-charts';
//import { ErrorDialogComponent } from '../Dialogs/error-dialog/error-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FillTankComponent } from '../tank/fill-tank/fill-tank.component';
import { TranslateModule } from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import { PipeModule } from 'app/main/helpers/pipe/pipe.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
const routes : Routes = [
  {
    path : '',
    component : CardCouponComponent,
    resolve : {
      data: CardCouponService
    }
  },
  {
    path: 'log/:couponId',
    component : CardCouponLogComponent,
  },
  {
    path: 'tanks',
    component: TankComponent
  }
]
@NgModule({
  declarations: [CardCouponComponent, 
    CardCouponFormComponent, 
    AffectCouponFormComponent, 
    CardCouponLogComponent,
     TankComponent, 
     NewTankComponent, 
     FillTankComponent],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSelectModule,
    MatMenuModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    FuseWidgetModule,
    ChartsModule,
    NgxChartsModule,
    MatDialogModule ,
    TranslateModule,
    MatCardModule,
    PipeModule,
    MatTooltipModule,
    MatCheckboxModule
  ],
  providers:[
    CardCouponService
  ],
  entryComponents:[
    CardCouponFormComponent,
    AffectCouponFormComponent,
    ReminderCouponComponent,
    NewTankComponent,
    FillTankComponent
  ]
})
export class CardCouponModule { }
