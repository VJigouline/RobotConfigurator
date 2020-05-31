import { Component, OnInit } from '@angular/core';
import { MachineService } from '../machine/machine.service';
import { Link } from '../machine/link';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Machine } from '../machine/machine';
import { saveAs } from 'file-saver';

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

  get TableChain(): Link[] {
    const ret = new Array<Link>();

    if (!this.machineService.machine) { return ret; }

    let link = this.machineService.machine.TableChain;
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
    const main = this.MainChain;
    const free = this.FreeLinks;
    if (event.previousContainer === event.container) {
      moveItemInArray(main, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(free,
                        main,
                        event.previousIndex,
                        event.currentIndex);
    }
    if (main.length) {
      this.machineService.machine.MainChain = main[0];
      let parent: Link = null;
      for (const l of main) {
        l.Children = [];
        l.Parent = parent;
        if (parent) { parent.Children = [l]; }
        parent = l;
      }
    } else {
      this.machineService.machine.MainChain = null;
    }
    for (const l of free) {
      l.Parent = null;
      l.Children = [];
    }
  }

  onTableChainDropped(event: CdkDragDrop<Link[]>) {
    const main = this.TableChain;
    const free = this.FreeLinks;
    if (event.previousContainer === event.container) {
      moveItemInArray(main, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(free,
                        main,
                        event.previousIndex,
                        event.currentIndex);
    }
    if (main.length) {
      this.machineService.machine.TableChain = main[0];
      let parent: Link = null;
      for (const l of main) {
        l.Children = [];
        l.Parent = parent;
        if (parent) { parent.Children = [l]; }
        parent = l;
      }
    } else {
      this.machineService.machine.TableChain = null;
    }
    for (const l of free) {
      l.Parent = null;
      l.Children = [];
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

  onNewLink(): void {
    if (!this.machineService.machine) {
      this.machineService.machine = new Machine(); 
    }
    this.machineService.machine.Links.push(new Link());
  }

  onSave(): void {
    const json = JSON.stringify(this.machineService.machine);
    const blob = new Blob([json], {type: 'text/plain;charset=utf-8'});
    saveAs.saveAs(blob, this.machineService.machine.Name + '.mcf');
  }

}
