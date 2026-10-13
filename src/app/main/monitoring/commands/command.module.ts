import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { CommandsComponent } from './commands.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FuseSharedModule } from '@fuse/shared.module';


@NgModule({
  declarations: [CommandsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    TranslateModule,
    MatPaginatorModule,
    MatToolbarModule,
    FuseSharedModule
    
  ],
  exports: [
    CommandsComponent
  ]
})
export class CommandModule { }
