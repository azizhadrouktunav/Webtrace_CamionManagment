import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { exportTableExcel, exportTablePdf } from '../orient-shared/orient-export';

export interface KpiDetailColumn {
  key: string;
  label: string;
}

export interface KpiDetailData {
  title: string;
  columns: KpiDetailColumn[];
  rows: { [key: string]: string }[];
  empty: string;
  tripAction?: boolean;
}

@Component({
  selector: 'app-kpi-detail-dialog',
  templateUrl: './kpi-detail-dialog.component.html',
  styleUrls: ['./_dash-dialog.scss', './kpi-detail-dialog.component.scss']
})
export class KpiDetailDialogComponent implements AfterViewInit {
  title = '';
  empty = '';
  tripAction = false;
  viewingTrips = false;
  filterText = '';
  tableOn = true;
  columnIds: string[] = [];
  columns: KpiDetailColumn[] = [];
  dataSource = new MatTableDataSource<{ [key: string]: string }>([]);

  private listTitle = '';
  private listEmpty = '';
  private listFilter = '';
  private listTripAction = false;
  private listColumns: KpiDetailColumn[] = [];
  private listRows: { [key: string]: string }[] = [];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private dialogRef: MatDialogRef<KpiDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: KpiDetailData
  ) {
    this.title = data.title;
    this.empty = data.empty;
    this.tripAction = !!data.tripAction;
    this.columns = data.columns || [];
    this.applyColumns();
    this.dataSource.filterPredicate = (row, filter) => this.matches(row, filter);
    this.dataSource.data = data.rows || [];
  }

  ngAfterViewInit(): void {
    this.attachPaginator();
  }

  applyFilter(event: Event): void {
    this.filterText = ((event.target as HTMLInputElement).value || '');
    this.dataSource.filter = this.filterText.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportPdf(): void {
    const table = this.tableParts();
    exportTablePdf(this.title, table.headers, table.rows);
  }

  exportExcel(): void {
    const table = this.tableParts();
    exportTableExcel(this.title, table.headers, table.rows);
  }

  openTrips(row: { [key: string]: string }): void {
    const count = Math.max(0, Math.round(Number(row.trips) || 0));
    if (!count) {
      return;
    }
    this.listTitle = this.title;
    this.listEmpty = this.empty;
    this.listFilter = this.filterText;
    this.listTripAction = this.tripAction;
    this.listColumns = this.columns.slice();
    this.listRows = this.dataSource.data.slice();

    const loadA = this.numFrom(row.loadA, row.loading);
    const outA = this.numFrom(row.outA, row.outbound);
    const unloadA = this.numFrom(row.unloadA, row.unloading);
    const retA = this.numFrom(row.retA, row.ret);
    const loadS = this.standardFrom(row.loadS, row.loading);
    const outS = this.standardFrom(row.outS, row.outbound);
    const unloadS = this.standardFrom(row.unloadS, row.unloading);
    const retS = this.standardFrom(row.retS, row.ret);
    const loads = this.spread(loadA, count);
    const outs = this.spread(outA, count);
    const unloads = this.spread(unloadA, count);
    const rets = this.spread(retA, count);
    const rows: { [key: string]: string }[] = [];
    const startMin = Number(row.whenMin);
    const cycleMin = loadA + outA + unloadA + retA;
    let i: number;
    for (i = 0; i < count; i++) {
      const total = loads[i] + outs[i] + unloads[i] + rets[i];
      const at = (isNaN(startMin) ? 0 : startMin) + Math.round(i * cycleMin);
      rows.push({
        when: row.whenDate ? this.formatTripWhen(row.whenDate, at) : (row.when || '—'),
        n: String(i + 1),
        loading: this.pair(loads[i], loadS),
        outbound: this.pair(outs[i], outS),
        unloading: this.pair(unloads[i], unloadS),
        ret: this.pair(rets[i], retS),
        total: this.pair(total, loadS + outS + unloadS + retS)
      });
    }
    this.viewingTrips = true;
    this.tripAction = false;
    this.title = 'Voyages de ' + (row.driver || 'chauffeur');
    this.empty = 'Aucun voyage.';
    this.columns = [
      { key: 'when', label: 'Date et heure' },
      { key: 'n', label: 'N°' },
      { key: 'loading', label: 'Chargement' },
      { key: 'outbound', label: 'Trajet aller' },
      { key: 'unloading', label: 'Déchargement' },
      { key: 'ret', label: 'Retour' },
      { key: 'total', label: 'Total' }
    ];
    this.applyColumns();
    this.showRows(rows, '');
  }

  backToList(): void {
    this.viewingTrips = false;
    this.tripAction = this.listTripAction;
    this.title = this.listTitle;
    this.empty = this.listEmpty;
    this.columns = this.listColumns.slice();
    this.applyColumns();
    this.showRows(this.listRows, this.listFilter);
  }

  close(): void {
    this.dialogRef.close();
  }

  private applyColumns(): void {
    this.columnIds = this.columns.map((col) => col.key);
    if (this.tripAction) {
      this.columnIds.push('action');
    }
  }

  private showRows(rows: { [key: string]: string }[], filter: string): void {
    this.filterText = filter;
    this.dataSource.filter = filter.trim().toLowerCase();
    this.dataSource.data = rows;
    this.tableOn = false;
    setTimeout(() => {
      this.tableOn = true;
      this.attachPaginator();
    });
  }

  private attachPaginator(): void {
    setTimeout(() => {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
        if (this.filterText.trim()) {
          this.paginator.firstPage();
        }
      }
    });
  }

  private matches(row: { [key: string]: string }, filter: string): boolean {
    const parts: string[] = [];
    let i: number;
    for (i = 0; i < this.columns.length; i++) {
      parts.push(row[this.columns[i].key] || '');
    }
    return parts.join(' ').toLowerCase().indexOf(filter) >= 0;
  }

  private visibleRows(): { [key: string]: string }[] {
    if (this.filterText.trim()) {
      return this.dataSource.filteredData;
    }
    return this.dataSource.data;
  }

  private tableParts(): { headers: string[]; rows: string[][] } {
    const headers = this.columns.map((col) => col.label);
    const source = this.visibleRows();
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < source.length; i++) {
      const row = source[i];
      rows.push(this.columns.map((col) => row[col.key] || ''));
    }
    return { headers: headers, rows: rows };
  }

  private numFrom(stored: string, display: string): number {
    if (stored != null && stored !== '') {
      return Number(stored) || 0;
    }
    return Number((display || '').split('/')[0]) || 0;
  }

  private standardFrom(stored: string, display: string): number {
    if (stored != null && stored !== '') {
      return Number(stored) || 0;
    }
    const parts = (display || '').split('/');
    return Number(parts.length > 1 ? parts[1] : parts[0]) || 0;
  }

  private spread(target: number, count: number): number[] {
    const values: number[] = [];
    if (count <= 0) {
      return values;
    }
    if (count === 1) {
      return [this.round1(target)];
    }
    let sum = 0;
    let i: number;
    for (i = 0; i < count - 1; i++) {
      const delta = ((i % 5) - 2) * 0.4;
      const value = this.round1(Math.max(0.1, target + delta));
      values.push(value);
      sum += value;
    }
    values.push(this.round1(Math.max(0.1, target * count - sum)));
    return values;
  }

  private pair(actual: number, standard: number): string {
    return this.round1(actual) + ' / ' + standard;
  }

  private round1(value: number): number {
    return Math.round(value * 10) / 10;
  }

  private formatTripWhen(iso: string, totalMin: number): string {
    const base = new Date(iso + 'T00:00:00');
    if (isNaN(base.getTime())) {
      return '—';
    }
    const stamp = new Date(base.getTime() + Math.round(totalMin) * 60000);
    const date = stamp.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    const hh = stamp.getHours();
    const mm = stamp.getMinutes();
    const hhs = hh < 10 ? '0' + hh : String(hh);
    const mms = mm < 10 ? '0' + mm : String(mm);
    return date + ' · ' + hhs + ':' + mms;
  }
}
