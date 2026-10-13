import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CardCoupon, MissionCardCoupon } from './model';
import { CardCouponService } from './card-coupon.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardCouponFormComponent } from './card-coupon-form/card-coupon-form.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AffectCouponFormComponent } from './affect-coupon-form/affect-coupon-form.component';
import { ReminderCouponComponent } from './reminder-coupon/reminder-coupon.component';
import { ErrorDialogComponent } from '../Dialogs/error-dialog/error-dialog.component';
import { ErrorHandlerService } from 'app/main/error-pages/error-handler.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from '../i18n/en';
import { locale as arabic } from '../i18n/ar';
import { locale as french } from '../i18n/fr';
import { validateDates } from '../maintenance/department';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { merge } from 'rxjs/internal/observable/merge';
import { map } from 'rxjs/internal/operators/map';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { isEmpty, values } from 'lodash';
import { isNullOrUndefined } from 'util';
import { showError } from 'app/main/helpers/show-error';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'card-coupon',
  templateUrl: './card-coupon.component.html',
  styleUrls: ['./card-coupon.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class CardCouponComponent implements OnInit , OnDestroy{
displayedColumns = ['N°', 'Card/Coupon', 'Free/Affected', 'Money/Liter', 'Quantity',
 'Total amount', 'Driver','Vehicule', 'Supplier', 'Expiration date', 'Tank','actions'];
dataSource : MatTableDataSource<CardCoupon>;
dialogRef: any;
confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
missionCardCoupon: MissionCardCoupon[] = [];
whichButton: number = 0;
filterBy: string;
start:Date = new Date();
end:Date = new Date();
dateRangeForm: FormGroup;
isValidDate:any;
data : any = [];
locale : string;
searchkey:string;
cardChecked: boolean = true;
couponChecked: boolean = true;
dataTranslate:any;
isDisabledDelete = true;
// Private
private _unsubscribeAll: Subject<any>;
card : any;
@ViewChild('TABLE', {static: true}) table: ElementRef;
  constructor(public httpClient: HttpClient,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private _fuseTranslationLoaderService : FuseTranslationLoaderService,
              private _cardCouponService: CardCouponService,
              private _translate : TranslateService
              ) {
                // Load the translations
    this._fuseTranslationLoaderService.loadTranslations(english, french , arabic);
   
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this._translate.get(['NAV.MsgDelteCardNotFree' ]).subscribe(data => { this.dataTranslate = data })

              }
@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
@ViewChild(MatSort, {static: true}) sort: MatSort;
@ViewChild('filter',  {static: true}) filter: ElementRef;
  ngOnInit() {
    if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
      this.isDisabledDelete= false;
    else
    this.isDisabledDelete= true;
    this.dataSource = new MatTableDataSource([]);
    const fromDate = new Date();
    //fromDate.setMonth(fromDate.getMonth() )
    fromDate.setDate(1 )
    this.dateRangeForm = this.formBuilder.group({
      start: [fromDate, Validators.required],
      end:  [new Date(), Validators.required],
      showCard: [this.cardChecked],
      showCoupon: [this.couponChecked]
    });
    /*if(this.dateRangeForm.valid){
      this._cardCouponService.getAllCardAndCouponByValidationDateBetween(this.dateRangeForm.get('start').value,this.dateRangeForm.get('end').value)
      .then(values => {
        this.dataSource.data = values;
      })
      .catch(reason => {
        console.log('Somthing happens wrong'+ reason);
      });
    }*/

  }
  /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
radioChangeCard(e){
 
  this.cardChecked = e.checked;
}
radioChangeCoupon(e){
  
  this.couponChecked = e.checked;
}
private refreshTable() {
  // Refreshing table using paginator
  // Thanks yeager-j for tips
  // https://github.com/marinantonio/angular-mat-table-crud/cardCoupons/12

  this._cardCouponService.onCouponsChanged
  .pipe(takeUntil(this._unsubscribeAll))
  .subscribe(data => {
    this.dataSource.data = data;
  });
  this.paginator._changePageSize(this.paginator.pageSize);
}
delete(card: CardCoupon) {
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});
this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';
this.confirmDialogRef.afterClosed().subscribe(result => {
  
  if (result) {
    if(card.Driver == null)
    {
      this._cardCouponService.deleteCardCoupon(card.Id);
      const Index = this._cardCouponService.data.indexOf(card);
      this._cardCouponService.onCouponsChanged.value.splice(Index, 1 );
      this.refreshTable();
    }
    else {
      showError(this.dataTranslate['NAV.MsgDelteCardNotFree'], this._matDialog);
    }
  }
  else {
    this.confirmDialogRef = null;
  }
},
error => {
  alert(error)
});
}
edit(action: string,cardCoupon: CardCoupon){
  
   let cardCoupons : CardCoupon[] = this.dataSource.filteredData;
   const index = cardCoupons.indexOf(cardCoupon)
   cardCoupons.splice(index, 1);
   this.dialogRef = this._matDialog.open(CardCouponFormComponent, {
    panelClass: ['event-form-dialog', 'custom-dialog-container'],
    data      : {
      cardCoupon : cardCoupon,
      action: action
    }
});
this.dialogRef.afterClosed()
.subscribe(response => {
  if ( !response )
          {
              return;
          }
const actionType: string = response[0];
const formData: FormGroup = response[1];
 switch(actionType) {
              /**
               * Save
               */
              case 'save':
                const newCard = formData.getRawValue();
                let card = cardCoupons.find(card => card.CardCouponRef == newCard.CardCouponRef_)
                if(!isNullOrUndefined(card)){
                  let msgErr = '';
                  const sub = this._translate.get('ExistNumOfCardOrCoupon').subscribe(data => {
                         msgErr = data;
                  });
                  sub.unsubscribe();
                  showError(msgErr, this._matDialog);
                }
                else {
                  this._cardCouponService.updateCardCoupon(newCard, cardCoupon.Id);
                  this.refreshTable();
                }
                break;
              /**
               * Delete
               */
              case 'delete':

                  this.delete(cardCoupon);
                  break;
}
});
}
add() : void {
  this.dialogRef = this._matDialog.open(CardCouponFormComponent, {
    panelClass: ['event-form-dialog', 'custom-dialog-container'],
    data      : {
      action: 'new'
    }
});

this.dialogRef.afterClosed().subscribe(result => {
  if(!result) {
    return;
  }
    const newCard = result.getRawValue();
    this._cardCouponService.addCardCoupon(newCard);
    this.refreshTable();
});
}
// AffectCardCoupon
affect(cardCoupon: CardCoupon){
  this.dialogRef = this._matDialog.open(AffectCouponFormComponent, {
    panelClass: ['event-form-dialog', 'custom-dialog-container'],
    data      : {
      Id: cardCoupon.Id,
      cardCoupon:cardCoupon,
      drivers : this._cardCouponService.getDrivers(),
      vehicles : this._cardCouponService.getVehicles()
    }
  });
  this.dialogRef.afterClosed()
     .subscribe(result => {
        if(!result){
          return;
        }
    const affectRes = result;
    var driverAffected : boolean = isEmpty(this._cardCouponService.cardCoupons.find(item => item.Driver === affectRes.idDriver));
    if(driverAffected) {
      this._cardCouponService.affectCardCoupon(affectRes, cardCoupon.Id).subscribe(data => {
        if(data){
          data.forEach(item => {
          const foundIndex = this._cardCouponService.onCouponsChanged.value.findIndex(x => x.Id === cardCoupon.Id);
          // Then you update that record using data from dialogData (values you enetered)
          var _item = new CardCoupon(item)
          
          var drivers = this._cardCouponService.getDrivers()
          
           _item.DriverString = drivers.find(driver => driver.Id === _item.Driver).FullName;
           _item.Vehicle = this._cardCouponService.getVehicles().find(vehicle => vehicle.Id === _item.Car).FullName;
          this._cardCouponService.onCouponsChanged.value[foundIndex] = _item;
          // And lastly refresh table
          this.refreshTable();
          });
          this._matSnackBar.open('Successfully affected', '' , {
            duration: 3000,
            // here specify the position
           verticalPosition: 'bottom',
           horizontalPosition: 'right'})
           this.refreshTable()
        }
      },
      (err: HttpErrorResponse) => {
        this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' , {
          duration: 8000,
          // here specify the position
         verticalPosition: 'bottom',
         horizontalPosition: 'right'})
    });
    }
    else {
      var msg:string = '';
      this._translate.get('ThisDriverHasCard').subscribe(data => {
        msg = data;
      })
      this._matSnackBar.open(msg, 'OK' , {
        duration: 3000,
        // here specify the position
       verticalPosition: 'top',
       //horizontalPosition: 'right'
      });
    }
    
});

}

// CardCouponId ReleaseCardCoupon
// popup: Warning: Do not select free card or coupon.
releaseCardCoupon(Id: number){
    this._cardCouponService.releaseCardCoupon(Id).subscribe(data => {
      if(data == true){
        this._matSnackBar.open('successfully liberation', 'Ok' , {
          duration: 5000,
          // here specify the position
         verticalPosition: 'top'})
      }
      else if(data == false){
        this._matSnackBar.open('Error of liberation, Please try again', 'Ok' , {
          duration: 5000,
          // here specify the position
         verticalPosition: 'top'})
      }
    },
    (err: HttpErrorResponse) => {
      this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' , {
        duration: 8000,
        // here specify the position
       verticalPosition: 'top'})
  })
   }
// create reminder AddOrUpdateCardCouponReminder
reminder(cardCoupon: CardCoupon){
  this.dialogRef = this._matDialog.open(ReminderCouponComponent, {
    panelClass: ['event-form-dialog', 'custom-dialog-container'],
    data      : {
      // Id: cardCoupon.Id,
      // driver : cardCoupon.DriverString,
      // driverId : cardCoupon.Driver
      cardCoupon: cardCoupon,
      drivers: this._cardCouponService.getDrivers()
    }
  });
  this.dialogRef.afterClosed()
  .subscribe(result => {
     if(!result){
       return;
     }
 const reminderRes = result
 this._cardCouponService.reminder(reminderRes).subscribe(data => {
   if(data){
     
    this._matSnackBar.open('Successful registration', '' , {
      duration: 3000,
      // here specify the position
     verticalPosition: 'bottom',
     horizontalPosition: 'right'})
    }
  },
  (err: HttpErrorResponse) => {
    this._matSnackBar.open('Error occurred. Details: ' + err.name + ' ' + err.message, '' , {
      duration: 8000,
      // here specify the position
     verticalPosition: 'bottom',
     horizontalPosition: 'right'})
})
})
}
 /**
     * Change the filter
     *
     * @param filter
     */
changeFilter(filter): void
{
    this.filterBy = filter;
    this._cardCouponService.onFilterChanged.next(this.filterBy);
}
onFormSubmit() {
  
  if(this.dateRangeForm.valid) {
    let showCard = this.dateRangeForm.get('showCard').value;
    let showCoupon = this.dateRangeForm.get('showCoupon').value;
    let startDate = this.dateRangeForm.get('start').value;
    let EndDate= this.dateRangeForm.get('end').value;
    this._cardCouponService.getAllCardAndCouponByValidationDateBetween(startDate,EndDate,showCard,showCoupon).then((values:any)=>{
      this.dataSource.data = values;
    }).catch((reason : any) => {
      console.log(reason);
    });



   /* if(this.dateRangeForm.get('showCard').value && this.dateRangeForm.get('showCoupon').value === false)
    {
      this._cardCouponService.getAllCard().then((values: any) => {
        this.dataSource.data = values;
      })
      .catch((reason : any) => {
        console.log(reason);
      });
    }
    else if(this.dateRangeForm.get('showCard').value === false && this.dateRangeForm.get('showCoupon').value){
      this._cardCouponService.getCouponByValidationDateBetween(this.dateRangeForm.get('start').value,this.dateRangeForm.get('end').value).then((values: any) => {
        this.dataSource.data = values;
      })
      .catch((reason : any) => {
        console.log(reason);
      });
    }
    else if(this.dateRangeForm.get('showCard').value && this.dateRangeForm.get('showCoupon').value) {
      this._cardCouponService.getAllCardAndCouponByValidationDateBetween(this.dateRangeForm.get('start').value,this.dateRangeForm.get('end').value).then((values: any) => {
        this.dataSource.data = values;
      })
      .catch((reason : any) => {
        console.log(reason);
      });
    }
    else {
      this.dataSource.data = [];
    }*/



    
  }
}
tabChanged(tabChangeEvent: MatTabChangeEvent): void {
  this.whichButton = tabChangeEvent.index;
}
// export pdf
exportpdf() {
  
  var prepare=[];
this._cardCouponService.onCouponsChanged.value.forEach(e=>{
  var tempObj =[];
  tempObj.push(e.CardCouponRef);
  tempObj.push(e.CardCoupnTypeEnumString);
  tempObj.push(e.CardCoupnStateEnumString);
  tempObj.push(e.QuantityL);
  tempObj.push(e.TotalPrice);
  tempObj.push(e.Vehicle);
  tempObj.push(e.SupplierFuelString);
  tempObj.push(e.DateCardCouponLocal.toLocaleString());
  prepare.push(tempObj);
});
const doc = new jsPDF('p', 'pt');
 doc.setFontSize(12);
doc.setTextColor(0);
doc.setFontStyle('bold');
doc.text('Management cards & coupons', 78, 20); //default

doc.autoTable({
    head: [['N°','Carte/Bon','Libre/Affecté','Quantité','Montant total','Véhicule', 'Fournisseur' , 'Date de validité', 'Citerne']],
    body: prepare
});
doc.save('Gestion des bons et des cartes de carburant' + '.pdf');
}
ExportTOExcel(){
  var prepare_to_excel= [['N°','Carte/Bon','Libre/Affecté','Quantité','Montant total','Véhicule', 'Fournisseur' , 'Date de validité', 'Citerne']];
  this._cardCouponService.onCouponsChanged.value.forEach(e=>{
    var tempObj =[];
    tempObj.push(e.CardCouponRef);
    tempObj.push(e.CardCoupnTypeEnumString);
    tempObj.push(e.CardCoupnStateEnumString);
    tempObj.push(e.QuantityL);
    tempObj.push(e.TotalPrice);
    tempObj.push(e.Vehicle);
    tempObj.push(e.SupplierFuelString);
    tempObj.push(e.DateCardCouponLocal.toLocaleString());
    prepare_to_excel.push(tempObj);
  });
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
  const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
  XLSX.writeFile(workbook, 'Gestion_Bon_Coupon.xls', { bookType: 'xls', type: 'buffer' });
}
}
// export class FilesDataSource extends DataSource<any>
// {
//   _filterChange = new BehaviorSubject('');

//   get filter(): string {
//     return this._filterChange.value;
//   }

//   set filter(filter: string) {
//     this._filterChange.next(filter);
//   }

//   filteredData: CardCoupon[] = [];
//   renderedData: CardCoupon[] = [];

//   constructor(public _cardCouponService: CardCouponService,
//               public _paginator: MatPaginator,
//               public _sort: MatSort) {
//     super();
//     // Reset to the first page when the user changes the filter.
//     this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
//   }

//   /** Connect function called by the table to retrieve one stream containing the data to render. */
//   connect(): Observable<CardCoupon[]> {
//     // Listen for any changes in the base data, sorting, filtering, or pagination
//     const displayDataChanges = [
//       this._cardCouponService.onCouponsChanged,
//       this._sort.sortChange,
//       this._filterChange,
//       this._paginator.page
//     ];
//     this._cardCouponService.getCardOrCoupon();


//     return merge(...displayDataChanges).pipe(map( () => {
//         // Filter data
//         this.filteredData = this._cardCouponService.onCouponsChanged.value.slice().filter((cardCoupon: CardCoupon) => {
//           const searchStr = (cardCoupon.CardCouponRef + cardCoupon.DriverString + cardCoupon.SupplierFuelString + cardCoupon.Vehicle).toLowerCase();
//           return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
//         });

//         // Sort filtered data
//         const sortedData = this.sortData(this.filteredData.slice());

//         // Grab the page's slice of the filtered sorted data.
//         const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
//         this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
//         return this.renderedData;
//       }
//     ));
//   }
//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------


//     /**
//      * Sort data
//      *
//      * @param data
//      * @returns {any[]}
//      */
//     sortData(data): any[]
//     {
//         if ( !this._sort.active || this._sort.direction === '' )
//         {
//             return data;
//         }

//         return data.sort((a, b) => {
//             let propertyA: number | string = '';
//             let propertyB: number | string = '';
//             switch ( this._sort.active )
//             {
//                 case 'N°':
//                     [propertyA, propertyB] = [a.CardCouponRef, b.CardCouponRef];
//                     break;
//                 case 'Money/Liter':
//                     [propertyA, propertyB] = [a.IsCardCouponWorkByMoney, b.IsCardCouponWorkByMoney];
//                     break;
//                 case  'Quantity':
//                     [propertyA, propertyB] = [a.QuantityL, b.QuantityL];
//                     break;
//                 case 'Total amount':
//                     [propertyA, propertyB] = [a.TotalPrice, b.TotalPrice];
//                     break;
//                 case 'Driver':
//                     [propertyA, propertyB] = [a.DriverString, b.DriverString];
//                     break;
//                 case 'Vehicule':
//                     [propertyA, propertyB] = [a.Vehicle, b.Vehicle];
//                     break;
//                 case 'Supplier':
//                     [propertyA, propertyB] = [a.SupplierFuelString, b.SupplierFuelString];
//                     break;
//                 case 'Tank':
//                     [propertyA, propertyB] = [a.Tank, b.Tank];
//                     break;
//             }
//             const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
//             const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

//             return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
//         });
//     }

//     /**
//      * Disconnect
//      */
//     disconnect(): void
//     {
//     }
// }
