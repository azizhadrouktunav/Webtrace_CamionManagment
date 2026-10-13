import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenthistoryComponent } from './documenthistory.component';

describe('DocumenthistoryComponent', () => {
  let component: DocumenthistoryComponent;
  let fixture: ComponentFixture<DocumenthistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumenthistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
