import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotConfiguratorComponent } from './robot-configurator.component';

describe('RobotConfiguratorComponent', () => {
  let component: RobotConfiguratorComponent;
  let fixture: ComponentFixture<RobotConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobotConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
