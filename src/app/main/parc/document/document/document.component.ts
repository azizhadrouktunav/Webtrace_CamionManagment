import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, ElementRef, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { MatPaginator, MatTableDataSource, MatSort, MatTable, MatSnackBar } from '@angular/material';
import { locale as english } from '../../../../navigation/i18n/en';
import { locale as french } from '../../../../navigation/i18n/fr';
import { locale as arab } from '../../../../navigation/i18n/ar';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentmanagmentService } from '../documentmanagment.service';
import { LogDialogComponent } from '../log-dialog/log-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import * as XLSX from 'xlsx';  
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AddeditdocumentComponent } from '../addeditdocument/addeditdocument.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { json2array } from 'app/main/helpers/must-match.validator';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy  {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  dialogRef: any;

  datacarDocumentReminder: { keyTrackingObject: number; SessionId: string; };
  @ViewChild('ExampleTable', {static: false}) ExampleTable: ElementRef;
  @ViewChild('typeInput' , {read:ElementRef , static:true}) typeInput: ElementRef<HTMLInputElement>;

  @ViewChild(MatPaginator, {static: true})
  paginator: MatPaginator;

  @ViewChild('filter', {static: true})
  filter: ElementRef;

  @ViewChild(MatSort, {static: true})
  sort: MatSort;
  searchkey: string;
  trackingObjects : any = [] ;
  disabled = false;
  filteredOptions: Observable<string[]>;
  isDisabledDelete = true;
  private _unsubscribeAll: Subject<any>;
  tableColumns: string[] = ['DocumentTypeString', 'CarDocumentReminderFrequenceString', 'WarnMeBeforeNDayKmString' , 'NextCarDocumentReminder' , 'actions'];
  selectedValue : number;
  dataSource = new MatTableDataSource<any>();
  vehicules = this.fb.group({
    cars: ['']
  });
    /**
     * Constructor
     *
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     */
    constructor(
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        public  _matDialog: MatDialog, 
        private _documentmanagmentService: DocumentmanagmentService,
        private _activatedRoute: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english, french, arab);
        this._unsubscribeAll = new Subject();
    }
    
    ngOnInit() {
      if( localStorage.getItem("isAdminAuthorized") == "isAdminAuthorized")
        this.isDisabledDelete= false;
      else
      this.isDisabledDelete= true;
      this._activatedRoute.data.subscribe((data: {trackingObjects : any}) => {
        this.trackingObjects = json2array(data.trackingObjects.DicoTrackingObjects);
        this.trackingObjects = this.trackingObjects.map(obj => {
                    return {id: obj.Key, name: obj.FullName}
                    });
      });
        // Subscribe to update document on changes
        this._documentmanagmentService.onDocumentsChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(data => {
          this.dataSource.data = data;
        });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      const trackingObject = this._documentmanagmentService.getTrackingObject().subscribe(Id => {
           this.selectedValue = Id; 
      });
      trackingObject.unsubscribe();
      this.filteredOptions = this.vehicules.get('cars').valueChanges
      .pipe(
        startWith(''),
        map(value => value ? this._filter(value): this.trackingObjects.slice())
      );
    }
    displayFn = (car) => {
      if(car != null && car != "" && this.trackingObjects != null)
        return this.trackingObjects.find(x => x.id === car).name;
      return '';
      //? driver.Name : '';
    }
    private _filter(value: string): string[]{
      if(value.length > 1) {
        const filterValue = value.toLowerCase();
        console.log(filterValue);
        
        let results =  this.trackingObjects.filter(option => option.name.toLowerCase().includes(filterValue));
        return results
      }else{
        return this.trackingObjects;
      }
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
      this._documentmanagmentService.onDocumentsChanged.next([]);
    }
    addDocument(): void {
        const dialogRef = this._matDialog.open(AddeditdocumentComponent, {
          panelClass: 'custom-dialog-container',  
          data: {
            action: 'new', 
            types: this._documentmanagmentService.getTypes()     
          }     
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
          
          if ( !result )
          {
              return;
          }
          const newDocument = result.getRawValue();
          this._documentmanagmentService.addOrUpdateCarDocumentReminder(newDocument);
        });
      }
    editDocument(document): void
    {
        this.dialogRef = this._matDialog.open(AddeditdocumentComponent, {
            panelClass: 'custom-dialog-container',
            data      : {
                document: document,
                action : 'edit',
                types: this._documentmanagmentService.getTypes()
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
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._documentmanagmentService.addOrUpdateCarDocumentReminder(formData.getRawValue(),document);

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.removeDocument(document);

                        break;
                }
            });
    }

/**
 * Remove document**/
 removeDocument(document): void {
  this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});

this.confirmDialogRef.componentInstance.confirmMessage = 'deleteMsg';

this.confirmDialogRef.afterClosed().subscribe(result => {
    if ( result )
    {
        //this.matDialogRef.close();
        this._documentmanagmentService.removeCarDocumentReminder(document);
    }
    this.confirmDialogRef = null;
});
 }
  /**
   * New Adjust**/
  adjust(document?): void {
      
        const dialogRef = this._matDialog.open(LogDialogComponent, {
          panelClass: 'custom-dialog-container',  
          data: {
            action: 'adjust',     
          }     
        });
    
        dialogRef.afterClosed().subscribe((result: any) => {
          
          if ( !result )
          {
              return;
          }
          const newAdjust = result.getRawValue();
          this._documentmanagmentService.adjustCarDocumentLog(newAdjust, document);
        });
      }
    selected(e){
      console.log(e);
      
      this.router.navigate(['/parc/document'], { queryParams: { id: e.value } });
      this._documentmanagmentService.getCarDocumentReminder(e.value);
      this._documentmanagmentService.changeTrackingObject(e.value);
      this.selectedValue = e.value;
    }
    applyfilter(){
      this.dataSource.filter = this.searchkey.trim().toLowerCase();
    }
      navigate(document) {
        var matricule = this.trackingObjects.find(car => {return car.id === document.Car}).name;
        this.router.navigate([
          '/parc/document/document-log/' ,  document.Car , document.Id , document.DocumentType , matricule
        ]);
      }
    
    
    
    downloadPdf() {
      var prepare=[];
    this.dataSource.data.forEach(e=>{
      var tempObj =[];
      tempObj.push(e.DocumentTypeString);
      tempObj.push(e.CarDocumentReminderFrequenceString);
      tempObj.push(e.WarnMeBeforeNDayKmString);
      tempObj.push(e.NextCarDocumentReminder);
      prepare.push(tempObj);
    });
    const doc = new jsPDF();
    doc.text('Liste des documents', 78, 16); //default

    doc.autoTable({
        head: [['Type de document','Fréquence','Me rappeler avant','Prochain payement']],
        body: prepare,
        startY: 20

    });
    doc.save('Document_List' + '.pdf');
    }
    exportExcel(){
      var prepare_to_excel=[];
      let tem =[];
      tem.push('TType de document');
      tem.push('Fréquence');
      tem.push('Me rappeler avant');
      tem.push("Prochain payement");
      
      prepare_to_excel.push(tem);
      this.dataSource.data.forEach(e=>{
        var tempObj =[];
        tempObj.push(e.DocumentTypeString);
        tempObj.push(e.CarDocumentReminderFrequenceString);
        tempObj.push(e.WarnMeBeforeNDayKmString);
        tempObj.push(e.NextCarDocumentReminder);
        prepare_to_excel.push(tempObj);
      });
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(prepare_to_excel);
      const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      XLSX.writeFile(workbook, 'Document_List.xls', { bookType: 'xls', type: 'buffer' });
   }
}
 


  



