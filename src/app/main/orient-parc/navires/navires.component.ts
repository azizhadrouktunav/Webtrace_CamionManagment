import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, combineLatest } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Port, Ship } from 'app/mock/types/fleet';
import { exportTableExcel, exportTablePdf } from 'app/main/orient-shared/orient-export';
import { NavireFormDialogComponent } from './navire-form-dialog.component';

@Component({
  selector: 'app-orient-parc-navires',
  templateUrl: './navires.component.html',
  styleUrls: ['../../orient-shared/_orient-page.scss']
})
export class NaviresComponent implements OnInit, AfterViewInit, OnDestroy {
  ships: Ship[] = [];
  dataSource = new MatTableDataSource<Ship>([]);
  ports: Port[] = [];
  columns = ['name', 'imo', 'portId', 'actions'];

  private sub: Subscription;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    private store: MockStoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sub = combineLatest([this.store.ships, this.store.ports]).subscribe(([ships, ports]) => {
      this.ships = ships.slice();
      this.dataSource.data = this.ships;
      this.ports = ports.slice();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  portName(portId: string): string {
    for (let i = 0; i < this.ports.length; i++) {
      if (this.ports[i].id === portId) {
        return this.ports[i].name;
      }
    }
    return portId;
  }

  exportPdf(): void {
    exportTablePdf('Navires', this.exportHeaders(), this.exportRows());
  }

  exportExcel(): void {
    exportTableExcel('Navires', this.exportHeaders(), this.exportRows());
  }

  startAdd(): void {
    this.openForm(null);
  }

  startEdit(row: Ship): void {
    this.openForm(row);
  }

  remove(row: Ship): void {
    this.store.removeShip(row.id);
  }

  private exportHeaders(): string[] {
    return ['Nom', 'IMO', 'Port'];
  }

  private exportRows(): string[][] {
    const rows: string[][] = [];
    let i: number;
    for (i = 0; i < this.ships.length; i++) {
      const row = this.ships[i];
      rows.push([row.name || '', row.imo || '', this.portName(row.portId)]);
    }
    return rows;
  }

  private openForm(ship: Ship | null): void {
    const ref = this.dialog.open(NavireFormDialogComponent, {
      width: '640px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'orient-form-dialog',
      data: { ship: ship }
    });
    ref.afterClosed().subscribe((result: Ship | null) => {
      if (!result) {
        return;
      }
      this.store.upsertShip(result);
    });
  }
}
