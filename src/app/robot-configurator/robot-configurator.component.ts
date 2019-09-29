import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-robot-configurator',
  templateUrl: './robot-configurator.component.html',
  styleUrls: ['./robot-configurator.component.scss']
})
export class RobotConfiguratorComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() Width: number;
  @Input() Height: number;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
   }
}
