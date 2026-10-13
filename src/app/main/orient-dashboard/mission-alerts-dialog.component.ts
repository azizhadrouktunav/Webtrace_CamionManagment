import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { exportTableExcel, exportTablePdf } from '../orient-shared/orient-export';

export interface MissionAlertLine {
  when: string;
  mission: string;
  driver: string;
  truck: string;
  type: string;
  minutes: number;
  place: string;
}

export interface MissionAlertsData {
  lines: MissionAlertLine[];
  showMission: boolean;
}

@Component({
  selector: 'app-mission-alerts-dialog',
  templateUrl: './mission-alerts-dialog.component.html',
  styleUrls: ['./_dash-dialog.scss', './mission-alerts-dialog.component.scss']
})
export class MissionAlertsDialogComponent implements AfterViewInit {
  showMission = false;
  columns = ['when', 'driver', 'truck', 'type', 'minutes'];
  labels = ['Date et heure', 'Chauffeur', 'Camion', 'Type', 'Temps dépassé'];
  filterText = '';
  dataSource = new MatTableDataSource<MissionAlertLine>([]);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private dialogRef: MatDialogRef<MissionAlertsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: MissionAlertsData
  ) {
    const lines = data && data.lines ? data.lines : [];
    this.showMission = !!(data && data.showMission);
    if (this.showMission) {
      this.columns = ['when', 'mission', 'driver', 'truck', 'type', 'minutes'];
      this.labels = ['Date et heure', 'Mission', 'Chauffeur', 'Camion', 'Type', 'Temps dépassé'];
    }
    this.dataSource.filterPredicate = (row, filter) => {
      const text = [row.when, row.mission, row.driver, row.truck, row.type, String(row.minutes)].join(' ').toLowerCase();
      return text.indexOf(filter) >= 0;
    };
    this.dataSource.data = lines;
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
    exportTablePdf('Alertes', this.labels, this.tableRows());
  }

  exportExcel(): void {
    exportTableExcel('Alertes', this.labels, this.tableRows());
  }

  close(): void {
    this.dialogRef.close();
  }

  private tableRows(): string[][] {
    const source = this.filterText.trim() ? this.dataSource.filteredData : this.dataSource.data;
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < source.length; i++) {
      const row = source[i];
      if (this.showMission) {
        rows.push([row.when, row.mission, row.driver, row.truck, row.type, row.minutes + ' min']);
      } else {
        rows.push([row.when, row.driver, row.truck, row.type, row.minutes + ' min']);
      }
    }
    return rows;
  }
}
