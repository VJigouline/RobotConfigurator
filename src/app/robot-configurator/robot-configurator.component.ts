import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-robot-configurator',
  templateUrl: './robot-configurator.component.html',
  styleUrls: ['./robot-configurator.component.scss']
})
export class RobotConfiguratorComponent implements OnInit {

  @Input() Width: number;
  @Input() Height: number;

  constructor() { }

  ngOnInit() {
  }

}
