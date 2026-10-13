import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedDataService } from '../monitoring/shared-data.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        SharedDataService
      ]
    }
  }
}
