import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Driver } from 'app/mock/types/fleet';
import { fmtDate } from 'app/mock/utils/format';
import { exportTableExcel, exportTablePdf } from 'app/main/orient-shared/orient-export';
import { ChauffeurFormDialogComponent } from './chauffeur-form-dialog.component';

@Component({
  selector: 'app-orient-parc-chauffeurs',
  templateUrl: './chauffeurs.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class ChauffeursComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<Driver>([]);
  columns = [
    'lastName',
    'firstName',
    'email',
    'personnelCode',
    'phone',
    'smartLockCloseCard',
    'smartLockOpenCard',
    'birthDate',
    'birthPlace',
    'address',
    'department',
    'cin',
    'licenceCategory',
    'licenceNumber',
    'actions'
  ];
  fmtDate = fmtDate;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  private sub: Subscription;

  constructor(
    private store: MockStoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = this.store.drivers.subscribe((drivers) => {
      this.dataSource.data = drivers.slice();
      this.bindPaginator();
    });
  }

  ngAfterViewInit(): void {
    this.bindPaginator();
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  exportPdf(): void {
    exportTablePdf('Chauffeurs', this.exportHeaders(), this.exportRows());
  }

  exportExcel(): void {
    exportTableExcel('Chauffeurs', this.exportHeaders(), this.exportRows());
  }

  startAdd(): void {
    this.openForm(null);
  }

  startEdit(row: Driver): void {
    this.openForm(row);
  }

  remove(row: Driver): void {
    this.store.removeDriver(row.id);
  }

  private exportHeaders(): string[] {
    return [
      'Nom',
      'Prénom',
      'Email',
      'Code personnel',
      'N° de téléphone',
      'N° carte fermeture SmartLock',
      'N° carte ouverture SmartLock',
      'Date de naissance',
      'Lieu de naissance',
      'Adresse',
      'Département',
      'N° de CIN',
      'Genre du permis',
      'N° du permis'
    ];
  }

  private exportRows(): string[][] {
    const source = this.dataSource.data || [];
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < source.length; i++) {
      const row = source[i];
      rows.push([
        row.lastName || '',
        row.firstName || '',
        row.email || '',
        row.personnelCode || '',
        row.phone || '',
        row.smartLockCloseCard || '',
        row.smartLockOpenCard || '',
        row.birthDate ? fmtDate(row.birthDate) : '',
        row.birthPlace || '',
        row.address || '',
        row.department || '',
        row.cin || '',
        row.licenceCategory || '',
        row.licenceNumber || ''
      ]);
    }
    return rows;
  }

  private bindPaginator(): void {
    if (this.paginator && this.dataSource.paginator !== this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  private openForm(driver: Driver | null): void {
    const ref = this.dialog.open(ChauffeurFormDialogComponent, {
      width: '760px',
      maxWidth: '95vw',
      autoFocus: false,
      panelClass: 'orient-form-dialog',
      data: { driver: driver }
    });
    ref.afterClosed().subscribe((result: Driver | null) => {
      if (!result) {
        return;
      }
      this.store.upsertDriver(result);
    });
  }
}
