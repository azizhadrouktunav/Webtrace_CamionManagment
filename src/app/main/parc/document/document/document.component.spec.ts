import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentComponent } from './document.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { MatTableExporterModule } from 'mat-table-exporter';

describe('DocumentComponent', () => {
  let component: DocumentComponent;
  let fixture: ComponentFixture<DocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentComponent ],
      imports: [
        TranslateModule.forRoot(),
        MatTableExporterModule 
        ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
