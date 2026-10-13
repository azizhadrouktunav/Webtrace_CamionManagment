import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatTableModule} from '@angular/material/table';
import { Routes, RouterModule } from '@angular/router';
import { GetsionDesArticlesStocksComponent } from './getsion-des-articles-stocks.component';
import { FuseSharedModule } from '@fuse/shared.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import { GestionStockService } from './gestion-stock.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTooltipModule} from '@angular/material/tooltip';
import { UpdateArticleComponent } from './update-article/update-article.component';
import { AddArticleComponent } from './add-article/add-article/add-article.component';
import { DailogEntrerSortieArticlesComponent } from './dailog-entrer-sortie-articles/dailog-entrer-sortie-articles.component';
import { MovementStockComponent } from './movement-stock/movement-stock/movement-stock.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { UpdatemovementComponent } from './updatemovement/updatemovement.component';
import { DxButtonModule } from 'devextreme-angular';
import {  DxSelectBoxModule } from 'devextreme-angular';
import { DxDataGridModule,
         DxBulletModule,
         DxTemplateModule } from 'devextreme-angular';

const routes : Routes = [
  {
    path : '',
    component : GetsionDesArticlesStocksComponent,
    resolve  : {
      data: GestionStockService
    }
  },
  {
    path:'Movement_stock/:id',
    component: MovementStockComponent,
  } 
]
@NgModule({
  declarations: [GetsionDesArticlesStocksComponent, UpdateArticleComponent, AddArticleComponent, DailogEntrerSortieArticlesComponent, MovementStockComponent, UpdatemovementComponent ],
  imports: [
    RouterModule.forChild(routes),
    FuseSharedModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    TranslateModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxBulletModule,
    DxTemplateModule
  ],
  providers:[
    GestionStockService
  ],
  entryComponents:[
    UpdateArticleComponent, AddArticleComponent, DailogEntrerSortieArticlesComponent,UpdatemovementComponent
  ]
})
export class StockModule {}
