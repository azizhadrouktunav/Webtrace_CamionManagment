import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FuseDirectivesModule } from '@fuse/directives/directives';
import { FusePipesModule } from '@fuse/pipes/pipes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { QuicklinkModule } from 'ngx-quicklink';
import { FuseConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
//import { AddOperationVehiculeComponent } from 'app/main/parc/Dialogs/add-operation-vehicule/add-operation-vehicule.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';

import { RepairFormComponent } from 'app/main/parc/maintenance/repairs/repair-form/repair-form.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
//import { PaymentlogComponent } from 'app/main/parc/Dialogs/paymentlog/paymentlog.component';
//import { RenewContactComponent } from 'app/main/parc/Dialogs/renew-contact/renew-contact.component';
import { ReminderCouponComponent } from 'app/main/parc/card-coupon/reminder-coupon/reminder-coupon.component';
import { LogDialogComponent } from 'app/main/parc/document/log-dialog/log-dialog.component';
import { RenewContactComponent } from 'app/main/parc/Dialogs/renew-contact/renew-contact.component';
import { PaymentlogComponent } from 'app/main/parc/Dialogs/paymentlog/paymentlog.component';
import { ErrorDialogComponent } from 'app/main/parc/Dialogs/error-dialog/error-dialog.component';
import { MatCheckboxModule } from '@angular/material';
import { SelectCheckAllComponent } from 'app/main/reports/custom-material/select-check-all/select-check-all.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SnackbarMessageComponent } from 'app/main/helpers/snackbar-message/snackbar-message.component';

@NgModule({
    imports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FuseDirectivesModule,
        FusePipesModule,
        MatDialogModule,
        QuicklinkModule,
        MatButtonModule,
        MatMomentDateModule,
        TranslateModule,
        // New add
        MatToolbarModule,
        MatRadioModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        MatDatepickerModule,
        MatIconModule,
        MatAutocompleteModule,
        MatTooltipModule,
        MatSelectModule, MatCheckboxModule
    ],
    exports  : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FuseDirectivesModule,
        FusePipesModule,
        QuicklinkModule,
        MatButtonModule,
        SelectCheckAllComponent,
        MatSnackBarModule
    ],
    declarations :[FuseConfirmDialogComponent,LogDialogComponent,RepairFormComponent,PaymentlogComponent,
        RenewContactComponent,ReminderCouponComponent,ErrorDialogComponent,SelectCheckAllComponent, SnackbarMessageComponent],
    providers:[],
    entryComponents :[FuseConfirmDialogComponent,LogDialogComponent,
        RepairFormComponent,PaymentlogComponent,RenewContactComponent,ReminderCouponComponent,ErrorDialogComponent ]
})
export class FuseSharedModule
{
}
