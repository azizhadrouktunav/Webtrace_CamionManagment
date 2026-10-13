import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertConfigurationContainerComponent } from './alert-configuration-container/alert-configuration-container.component';
import { RouterModule, Routes } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GeneralSectionComponent } from './general-section/general-section.component';
import { TempuratureSectionComponent } from './tempurature-section/tempurature-section.component';
import { FuelSectionComponent } from './fuel-section/fuel-section.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SpeedSectionComponent } from './speed-section/speed-section.component';
import { StopSectionComponent } from './stop-section/stop-section.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import {  MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { ConductSectionComponent } from './conduct-section/conduct-section.component';
import {MatSelectModule} from '@angular/material/select';
import { GoefencingSectionComponent } from './goefencing-section/goefencing-section.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import {MatTreeModule} from '@angular/material/tree';

const routes: Routes = [
  {
      path     : '',
      component: AlertConfigurationContainerComponent,
      
  }
];

@NgModule({
  declarations: [AlertConfigurationContainerComponent, GeneralSectionComponent, TempuratureSectionComponent, FuelSectionComponent, SpeedSectionComponent, StopSectionComponent, ConductSectionComponent, GoefencingSectionComponent],
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatBadgeModule,
    MatSnackBarModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCardModule ,
    MatTreeModule
     
  ]
})
export class AlertConfigurationModule { }
