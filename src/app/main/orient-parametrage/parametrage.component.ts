import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockStoreService } from 'app/mock/mock-store.service';
import { ShiftConfig } from 'app/mock/types/settings';

@Component({
  selector: 'app-orient-parametrage',
  templateUrl: './parametrage.component.html',
  styleUrls: ['./parametrage.component.scss', '../orient-shared/_orient-page.scss']
})
export class ParametrageComponent implements OnInit, OnDestroy {
  shifts: ShiftConfig[] = [];

  private sub: Subscription;

  constructor(private store: MockStoreService) {}

  ngOnInit(): void {
    this.sub = this.store.shifts.subscribe((shifts) => {
      this.shifts = shifts.map((s) => Object.assign({}, s));
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  saveShifts(): void {
    this.store.setShifts(this.shifts);
  }
}
