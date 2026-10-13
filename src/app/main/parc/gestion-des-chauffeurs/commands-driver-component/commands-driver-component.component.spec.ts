import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsDriverComponentComponent } from './commands-driver-component.component';

describe('CommandsDriverComponentComponent', () => {
  let component: CommandsDriverComponentComponent;
  let fixture: ComponentFixture<CommandsDriverComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandsDriverComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsDriverComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
