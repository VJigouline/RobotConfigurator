import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Link } from '../link';
import { MatSliderChange } from '@angular/material/slider';
import { LinkType } from '../link-type.enum';

@Component({
  selector: 'app-machine-control',
  templateUrl: './machine-control.component.html',
  styleUrls: ['./machine-control.component.scss']
})
export class MachineControlComponent implements OnInit {
  @Output() updateLink = new EventEmitter<Link>();

  @Input() Link: Link;

  get MinPosition(): number {
    if (this.Link.Minimum) { return this.Link.Minimum; }
    switch (this.Link.Type) {
      case LinkType.LINEAR_JOINT:
        return -100;
      case LinkType.ARM:
        return -180;
    }

    return 0;
  }

  get MaxPosition(): number {
    if (this.Link.Maximum) { return this.Link.Maximum; }
    switch (this.Link.Type) {
      case LinkType.LINEAR_JOINT:
        return 100;
      case LinkType.ARM:
        return 180;
    }

    return 0;
  }

  get PositionStep(): number {
    return (this.MaxPosition - this.MinPosition) / 100;
  }

  constructor() { }

  ngOnInit(): void {
  }

  public onPositionChanged(event: MatSliderChange): void {
    this.Link.Position = event.value;
    this.Link.updateDynamicTransform(true);
    this.updateLink.emit(this.Link);
  }
}
