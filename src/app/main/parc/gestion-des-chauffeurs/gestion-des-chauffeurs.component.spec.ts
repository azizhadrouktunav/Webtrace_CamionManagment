import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDesChauffeursComponent } from './gestion-des-chauffeurs.component';

describe('GestionDesChauffeursComponent', () => {
  let component: GestionDesChauffeursComponent;
  let fixture: ComponentFixture<GestionDesChauffeursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionDesChauffeursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDesChauffeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
