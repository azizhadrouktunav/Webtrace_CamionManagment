import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuelTypes, truckTypes } from 'app/mock/data/trucks';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Driver, Truck, TruckStatus } from 'app/mock/types/fleet';

export interface CamionFormDialogData {
  truck: Truck | null;
}

@Component({
  selector: 'app-orient-camion-form-dialog',
  templateUrl: './camion-form-dialog.component.html',
  styleUrls: ['../_orient-form-dlg.scss']
})
export class CamionFormDialogComponent implements OnInit {
  isEdit = false;
  dialogTitle = 'Ajouter un véhicule';
  truckTypes = truckTypes;
  fuelTypes = fuelTypes;
  drivers: Driver[] = [];

  base: Truck | null = null;
  formPlate = '';
  formName = '';
  formType = '';
  formDepartment = '';
  formDriverId: string | null = null;
  formBrand = '';
  formModel = '';
  formYear: number | null = null;
  formFuelType = 'Gasoil';
  formMileage: number | null = null;
  formFuelCapacity: number | null = null;
  formSimCardNumber = '';
  formEquipmentSerial = '';
  formIconUrl = 'assets/images/logos/fuse.svg';

  constructor(
    private dialogRef: MatDialogRef<CamionFormDialogComponent, Truck | null>,
    @Inject(MAT_DIALOG_DATA) public data: CamionFormDialogData,
    private store: MockStoreService
  ) {}

  ngOnInit(): void {
    this.drivers = this.store.snapshotDrivers().slice();
    if (this.data.truck) {
      this.isEdit = true;
      this.dialogTitle = 'Modifier le véhicule';
      this.base = Object.assign({}, this.data.truck);
      this.bindForm(this.base);
    } else {
      const sample = this.store.snapshotTrucks()[0];
      this.base = Object.assign({}, sample, {
        id: this.store.nextTruckId(),
        plate: '',
        name: '',
        driverId: null,
        missionId: null,
        status: 'available' as TruckStatus,
        fixedStage: undefined,
        brand: 'Mercedes',
        model: 'Actros',
        year: new Date().getFullYear(),
        fuelType: 'Gasoil',
        mileage: 0,
        fuelCapacity: 400,
        simCardNumber: '',
        equipmentSerial: '',
        iconUrl: 'assets/images/logos/fuse.svg',
        department: 'TUNAV'
      });
      this.bindForm(this.base);
      this.formType = this.truckTypes[0] || '';
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (!this.base) {
      return;
    }
    const item = Object.assign({}, this.base, {
      plate: this.formPlate,
      name: this.formName,
      type: this.formType,
      department: this.formDepartment,
      driverId: this.formDriverId,
      brand: this.formBrand,
      model: this.formModel,
      year: this.formYear,
      fuelType: this.formFuelType,
      mileage: this.formMileage,
      fuelCapacity: this.formFuelCapacity,
      simCardNumber: this.formSimCardNumber,
      equipmentSerial: this.formEquipmentSerial,
      iconUrl: this.formIconUrl
    });
    this.dialogRef.close(item);
  }

  private bindForm(t: Truck): void {
    this.formPlate = t.plate;
    this.formName = t.name;
    this.formType = t.type;
    this.formDepartment = t.department || '';
    this.formDriverId = t.driverId;
    this.formBrand = t.brand || '';
    this.formModel = t.model || '';
    this.formYear = t.year != null ? t.year : null;
    this.formFuelType = t.fuelType || 'Gasoil';
    this.formMileage = t.mileage != null ? t.mileage : null;
    this.formFuelCapacity = t.fuelCapacity != null ? t.fuelCapacity : null;
    this.formSimCardNumber = t.simCardNumber || '';
    this.formEquipmentSerial = t.equipmentSerial || '';
    this.formIconUrl = t.iconUrl || 'assets/images/logos/fuse.svg';
  }
}
