import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { RobotViewComponent } from '../robot-view/robot-view.component';

@Component({
  selector: 'app-robot-configurator',
  templateUrl: './robot-configurator.component.html',
  styleUrls: ['./robot-configurator.component.scss']
})
export class RobotConfiguratorComponent implements OnInit, AfterViewInit {

  @Input() Width: number;
  @Input() Height: number;

  RobotViewHeight = 100;
  RobotViewWidth = 100;

  @ViewChild('RobotView')
  private robotView: ElementRef;

  constructor() { }

  ngOnInit() {
    this.OnResize();
  }

  ngAfterViewInit(): void {
    // this.OnResize();
  }

  OnResize(): void {
    if (this.robotView === undefined) {
      return;
    }
    this.RobotViewHeight = this.robotView.nativeElement.clientHeight;
    this.RobotViewWidth = this.robotView.nativeElement.clientWidth;
    console.log(`RobotViewHeight: ${this.RobotViewHeight}, RobotViewWidth: ${this.RobotViewWidth}`);
  }
}
