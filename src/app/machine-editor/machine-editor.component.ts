import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine/machine.service';
import { Link } from '../machine/link';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

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
    if (event.previousContainer === event.container) {
      const fl = this.MainChain[event.previousIndex];
      const parent = fl.Parent;
      if (parent) {
        parent.Children = fl.Children;
      }
      for (const c of fl.Children) { c.Parent = parent; }
      if (false) {
        const l = this.MainChain[0];
      } else {
        const l = this.MainChain[event.currentIndex];
        if (l === this.machineService.machine.MainChain) {
          this.machineService.machine.MainChain = fl;
        } else if (fl === this.machineService.machine.MainChain) {
          this.machineService.machine.MainChain =
            fl.Children.length ? fl.Children[0] : null;
        }
        fl.Parent = l.Parent;
        l.Parent = fl;
        fl.Children = [l];
        if (fl.Parent) {
          fl.Parent.Children = [fl];
        }
      }
    } else {
      const fl = this.FreeLinks[event.previousIndex];
      if (event.currentIndex >= this.MainChain.length) {
        const l = this.MainChain[this.MainChain.length - 1];
        fl.Parent = l;
        l.Children = [fl];
      } else if (!event.currentIndex) {
        const l = this.MainChain[0];
        fl.Children = [l];
        l.Parent = fl;
        this.machineService.machine.MainChain = fl;
      } else {
        const l = this.MainChain[event.currentIndex];
        fl.Parent = l.Parent;
        l.Parent = fl;
        fl.Children.push(l);
        if (fl.Parent) {
          fl.Parent.Children = [fl];
        }
      }
    }
  }

  onMainFreeLinksDropped(event: CdkDragDrop<Link[]>) {
    if (event.previousContainer === event.container) {
    } else {
      const l = this.MainChain[event.previousIndex];
      if (l.Parent) {
        l.Parent.Children = l.Children;
      } else if (l === this.machineService.machine.MainChain) {
        if (l.Children.length) {
          this.machineService.machine.MainChain = l.Children[0];
        }
      }
      for (const c of l.Children) { c.Parent = l.Parent; }
      l.Parent = null;
      l.Children = new Array<Link>();
    }
  }

}
