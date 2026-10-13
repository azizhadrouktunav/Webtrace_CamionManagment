import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { exportTableExcel, exportTablePdf } from '../orient-shared/orient-export';

export interface DoneMissionLine {
  id: string;
  name: string;
}

@Component({
  selector: 'app-done-missions-dialog',
  templateUrl: './done-missions-dialog.component.html',
  styleUrls: ['./_dash-dialog.scss', './done-missions-dialog.component.scss']
})
export class DoneMissionsDialogComponent implements AfterViewInit {
  columns = ['name', 'open'];
  filterText = '';
  dataSource = new MatTableDataSource<DoneMissionLine>([]);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private dialogRef: MatDialogRef<DoneMissionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) lines: DoneMissionLine[]
  ) {
    this.dataSource.filterPredicate = (row, filter) => {
      return (row.name || '').toLowerCase().indexOf(filter) >= 0;
    };
    this.dataSource.data = lines || [];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  applyFilter(event: Event): void {
    this.filterText = ((event.target as HTMLInputElement).value || '');
    this.dataSource.filter = this.filterText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportPdf(): void {
    exportTablePdf('Missions', ['Mission'], this.tableRows());
  }

  exportExcel(): void {
    exportTableExcel('Missions', ['Mission'], this.tableRows());
  }

  open(id: string): void {
    this.dialogRef.close(id);
  }

  close(): void {
    this.dialogRef.close('');
  }

  private tableRows(): string[][] {
    const source = this.filterText.trim() ? this.dataSource.filteredData : this.dataSource.data;
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < source.length; i++) {
      rows.push([source[i].name]);
    }
    return rows;
  }
}
