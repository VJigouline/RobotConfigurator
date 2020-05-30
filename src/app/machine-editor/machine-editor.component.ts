import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine/machine.service';
import { Link } from '../machine/link';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-machine-editor',
  templateUrl: './machine-editor.component.html',
  styleUrls: ['./machine-editor.component.scss']
})
export class MachineEditorComponent implements OnInit {

  get MainChain(): Link[] {
    const ret = new Array<Link>();

    if (!this.machineService.machine) { return ret; }

    let link = this.machineService.machine.MainChain;
    while (link) {
      ret.push(link);
      link = link.Children.length ? link.Children[0] : null;
    }

    return ret;
  }

  get FreeLinks(): Link[] {
    if (!this.machineService.machine) { return []; }

    return this.machineService.machine.FreeLinks;
  }

  constructor(
    private machineService: MachineService
  ) { }

  ngOnInit(): void {
  }

  onMainChainDropped(event: CdkDragDrop<Link[]>) {

  }

  onMainFreeLinksDropped(event: CdkDragDrop<Link[]>) {

  }

}
