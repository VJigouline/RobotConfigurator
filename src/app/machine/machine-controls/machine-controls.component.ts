import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MachineService } from '../machine.service';
import { Link } from '../link';
import { LinkType } from '../link-type.enum';

@Component({
  selector: 'app-machine-controls',
  templateUrl: './machine-controls.component.html',
  styleUrls: ['./machine-controls.component.scss']
})
export class MachineControlsComponent implements OnInit {
  @Output() updateLink = new EventEmitter<Link>();

  get MainControls(): Link[] {
    if (this.mainControls) { return this.mainControls; }

    if (!this.machineService.machine ||
      !this.machineService.machine.MainChain) {
        this.mainControls = null;
        return null;
    }

    const ret = new Array<Link>();
    let link = this.machineService.machine.MainChain;
    while (link) {
      if (link.Type !== LinkType.STATIC) { ret.push(link); }
      link = link.Children.length ? link.Children[0] : null;
    }

    this.mainControls = ret.length ? ret : null;

    return this.mainControls;
  }

  get TableControls(): Link[] {
    if (this.tableControls) { return this.tableControls; }

    if (!this.machineService.machine ||
      !this.machineService.machine.MainChain) {
        this.tableControls = null;
        return null;
    }

    const ret = new Array<Link>();
    let link = this.machineService.machine.TableChain;
    while (link) {
      if (link.Type !== LinkType.STATIC) { ret.push(link); }
      link = link.Children.length ? link.Children[0] : null;
    }

    this.tableControls = ret.length ? ret : null;

    return this.tableControls;
  }

  private mainControls: Link[];
  private tableControls: Link[];

  constructor(
    public machineService: MachineService
  ) { }

  ngOnInit(): void {
  }

  public updateControls(): void {
    this.mainControls = null;
    this.tableControls = null;
  }

  public onLinkUpdate(event: Link) {
    this.updateLink.emit(event);
  }

}
