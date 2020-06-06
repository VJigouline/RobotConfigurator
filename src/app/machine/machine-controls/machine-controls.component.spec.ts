import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineControlsComponent } from './machine-controls.component';

describe('MachineControlsComponent', () => {
  let component: MachineControlsComponent;
  let fixture: ComponentFixture<MachineControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
