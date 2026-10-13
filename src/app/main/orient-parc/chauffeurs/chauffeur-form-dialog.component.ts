import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MockStoreService } from 'app/mock/mock-store.service';
import { Driver, DriverStatus, Truck } from 'app/mock/types/fleet';
import { driverStatusMeta } from 'app/mock/utils/status';

export interface ChauffeurFormDialogData {
  driver: Driver | null;
}

@Component({
  selector: 'app-orient-chauffeur-form-dialog',
  templateUrl: './chauffeur-form-dialog.component.html',
  styleUrls: ['../_orient-form-dlg.scss']
})
export class ChauffeurFormDialogComponent implements OnInit {
  isEdit = false;
  dialogTitle = 'Ajouter un chauffeur';
  trucks: Truck[] = [];
  driverStatusMeta = driverStatusMeta;
  statusOptions: DriverStatus[] = ['on_duty', 'break', 'off_duty'];
  licenceCategories = ['B', 'C', 'C+E', 'D'];
  error = '';

  base: Driver | null = null;
  formLastName = '';
  formFirstName = '';
  formEmail = '';
  formPersonnelCode = '';
  formPhone = '';
  formSmartLockCloseCard = '';
  formSmartLockOpenCard = '';
  formBirthDate = '';
  formBirthPlace = '';
  formAddress = '';
  formDepartment = '';
  formCin = '';
  formLicenceCategory = '';
  formLicenceNumber = '';
  formStatus: DriverStatus = 'on_duty';
  formTruckId: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ChauffeurFormDialogComponent, Driver | null>,
    @Inject(MAT_DIALOG_DATA) public data: ChauffeurFormDialogData,
    private store: MockStoreService
  ) {}

  ngOnInit(): void {
    this.trucks = this.store.snapshotTrucks().slice();
    if (this.data.driver) {
      this.isEdit = true;
      this.dialogTitle = 'Modifier le chauffeur';
      this.base = Object.assign({}, this.data.driver);
      this.bindForm(this.base);
    } else {
      const sample = this.store.snapshotDrivers()[0];
      this.base = Object.assign({}, sample, {
        id: this.store.nextDriverId(),
        lastName: '',
        firstName: '',
        email: '',
        personnelCode: '',
        phone: '',
        smartLockCloseCard: '',
        smartLockOpenCard: '',
        birthDate: '',
        birthPlace: '',
        address: '',
        department: '',
        cin: '',
        licenceCategory: 'C+E',
        licenceNumber: '',
        truckId: null,
        status: 'on_duty' as DriverStatus,
        trips: 0,
        cycleAvg: 0,
        delays: 0,
        alerts: 0
      });
      this.bindForm(this.base);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    if (!this.base) {
      return;
    }
    if (
      !(this.formLastName || '').trim() ||
      !(this.formFirstName || '').trim() ||
      !(this.formPersonnelCode || '').trim() ||
      !(this.formDepartment || '').trim()
    ) {
      this.error = 'Veuillez renseigner les champs obligatoires (Nom, Prénom, Code personnel, Département).';
      return;
    }
    this.error = '';
    const item = Object.assign({}, this.base, {
      lastName: this.formLastName.trim(),
      firstName: this.formFirstName.trim(),
      email: (this.formEmail || '').trim(),
      personnelCode: this.formPersonnelCode.trim(),
      phone: (this.formPhone || '').trim(),
      smartLockCloseCard: (this.formSmartLockCloseCard || '').trim(),
      smartLockOpenCard: (this.formSmartLockOpenCard || '').trim(),
      birthDate: this.formBirthDate || '',
      birthPlace: (this.formBirthPlace || '').trim(),
      address: (this.formAddress || '').trim(),
      department: this.formDepartment.trim(),
      cin: (this.formCin || '').trim(),
      licenceCategory: this.formLicenceCategory || '',
      licenceNumber: (this.formLicenceNumber || '').trim(),
      status: this.formStatus,
      truckId: this.formTruckId
    });
    this.dialogRef.close(item);
  }

  private bindForm(d: Driver): void {
    this.formLastName = d.lastName;
    this.formFirstName = d.firstName;
    this.formEmail = d.email;
    this.formPersonnelCode = d.personnelCode;
    this.formPhone = d.phone;
    this.formSmartLockCloseCard = d.smartLockCloseCard;
    this.formSmartLockOpenCard = d.smartLockOpenCard;
    this.formBirthDate = d.birthDate;
    this.formBirthPlace = d.birthPlace;
    this.formAddress = d.address;
    this.formDepartment = d.department;
    this.formCin = d.cin;
    this.formLicenceCategory = d.licenceCategory;
    this.formLicenceNumber = d.licenceNumber;
    this.formStatus = d.status;
    this.formTruckId = d.truckId;
  }
}
