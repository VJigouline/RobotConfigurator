import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MachineService } from '../machine/machine.service';
import { Link } from '../machine/link';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart} from '@angular/cdk/drag-drop';
import { Machine } from '../machine/machine';
import { saveAs } from 'file-saver';
import { LinkHelper } from '../objects3d/link-helper';
import { ThreeSceneService } from '../three-scene.service';

@Component({
  selector: 'app-machine-editor',
  templateUrl: './machine-editor.component.html',
  styleUrls: ['./machine-editor.component.scss']
})
export class MachineEditorComponent implements OnInit {

  @Output() changeMachine = new EventEmitter<Machine>();

  get MachineName(): string {
    return this.machineService.machine ? this.machineService.machine.Name : '';
  }
  set MachineName(value: string) {
    if (this.machineService.machine) {
      this.machineService.machine.Name = value;
    }
  }

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
    private machineService: MachineService,
    private sceneService: ThreeSceneService
  ) { }

  ngOnInit(): void {
  }

  onMainChainDropped(event: CdkDragDrop<Link[]>): void {
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
    this.changeMachine.emit(this.machineService.machine);
  }

  onTableChainDropped(event: CdkDragDrop<Link[]>): void {
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
    this.changeMachine.emit(this.machineService.machine);
  }

  onFreeLinksDropped(event: CdkDragDrop<Link[]>): void {
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
    const l = new Link();
    l.defaultObject = new LinkHelper(l, 1, this.sceneService.camera);
    this.machineService.machine.Links.push(l);
  }

  onSave(): void {
    const json = JSON.stringify(this.machineService.machine);
    const blob = new Blob([json], {type: 'text/plain;charset=utf-8'});
    saveAs.saveAs(blob, this.machineService.machine.Name + '.mcf');
  }

  public onOpen(event: any): void {
    this.machineService.importMachine(event.target.files[0]);
    event.target.value = '';
  }

}
