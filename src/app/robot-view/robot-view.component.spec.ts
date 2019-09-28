import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RobotViewComponent } from './robot-view.component';

describe('RobotViewComponent', () => {
  let component: RobotViewComponent;
  let fixture: ComponentFixture<RobotViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RobotViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RobotViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
