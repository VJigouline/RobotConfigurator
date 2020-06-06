import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Link, Model } from '../link';
import { MachineService } from '../machine.service';
import { Machine } from '../machine';
import { MatSelectChange } from '@angular/material/select';
import { LinkType, LinkState } from '../link-type.enum';
import { Transform3 } from '../../geometries/transform3';
import { MatSliderChange } from '@angular/material/slider';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ThreeSceneService } from '../../three-scene.service';

enum LinkClass {
  TABLE = 'Table',
  MAIN = 'Main',
  FREE = 'Free'
}

class LinkDescription {
  Link: Link;
  Class: LinkClass;

  constructor(link: Link, lc: LinkClass) {
    this.Link = link;
    this.Class = lc;
  }
}

@Component({
  selector: 'app-link-editor',
  templateUrl: './link-editor.component.html',
  styleUrls: ['./link-editor.component.scss']
})

export class LinkEditorComponent implements OnInit {

  // events
  @Output() changeLink = new EventEmitter<Link>();

  // properties


  get Link(): LinkDescription {
    if (!this.link || !this.Links.find(l => l === this.link)) {
      this.link = this.Links.length ? this.Links[0] : null;
    }
    return this.link;
  }
  set Link(value: LinkDescription) {
    this.link = value;
  }

  get Links(): LinkDescription[] {
    if (this.links && this.links.length &&
      this.prevMachine === this.machineService.machine) {
      return this.links;
    }
    const ret = new Array<LinkDescription>();

    let l = this.machineService.machine.MainChain;
    while (l) {
      ret.push(new LinkDescription(l, LinkClass.MAIN));
      l = l.Children.length ? l.Children[0] : null;
    }
    l = this.machineService.machine.TableChain;
    while (l) {
      ret.push(new LinkDescription(l, LinkClass.TABLE));
      l = l.Children.length ? l.Children[0] : null;
    }
    for (const fl of this.machineService.machine.FreeLinks) {
      ret.push(new LinkDescription(fl, LinkClass.FREE));
    }

    this.links = ret;
    this.prevMachine = this.machineService.machine;
    return this.links;
  }

  get MinPosition(): number {
    if (this.Link.Link.Minimum) { return this.Link.Link.Minimum; }
    switch (this.Link.Link.Type) {
      case LinkType.LINEAR_JOINT:
        return -100;
      case LinkType.ARM:
        return -180;
    }

    return 0;
  }

  get MaxPosition(): number {
    if (this.Link.Link.Maximum) { return this.Link.Link.Maximum; }
    switch (this.Link.Link.Type) {
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

  get isLinearOrRotary(): boolean {
    return this.link && (this.link.Link.Type === LinkType.LINEAR_JOINT ||
      this.link.Link.Type === LinkType.ARM);
  }

  get FreeModels(): Model[] {
    const ret = new Array<Model>();

    for (const m of this.sceneService.models) {
      if (m.Parent) { continue; }
      ret.push(m);
    }

    return ret;
  }

  get Models(): Model[] {
    let ret = new Array<Model>();

    if (this.Link) { ret = this.Link.Link.models; }

    return ret;
  }

  link: LinkDescription;
  links: LinkDescription[];
  prevMachine: Machine;
  linkTypes = [
    { type: LinkType.ARM, name: 'Arm' },
    // { type: LinkType.BALL_JOINT, name: '' },
    // { type: LinkType.HEXAPOD, name: '' },
    { type: LinkType.LINEAR_JOINT, name: 'Linear' },
    // { type: LinkType.PIVOT_JOINT, name: '' },
    { type: LinkType.STATIC, name: 'Static' },
    // { type: LinkType.TRIPOD, name: '' },
    // { type: LinkType.UNIVERSAL_JOINT, name: '' }
  ];
  linkStates = [
    // { type: LinkState.AUXILIARY, name: 'Auxiliary' },
    { type: LinkState.DYNAMIC, name: 'Dynamic' },
    { type: LinkState.FROZEN, name: 'Frozen' },
    { type: LinkState.STATIC, name: 'Static' }
  ];

  constructor(
    public machineService: MachineService,
    private sceneService: ThreeSceneService
  ) { }

  ngOnInit(): void {
  }

  onSelectionChange(change: MatSelectChange): void {
  }

  onChangeTransformBase(transform: Transform3): void {
    this.changeLink.emit(this.link.Link);
  }

  onChangeTransformAttachment(transform: Transform3): void {
    this.changeLink.emit(this.link.Link);
  }

  copyBaseFromParentAttachment(): void {
    if (!this.link.Link.Parent) { return; }
    this.link.Link.Base.copy(this.link.Link.Parent.Attachment);
    this.changeLink.emit(this.link.Link);
  }

  public onPositionChanged(event: MatSliderChange): void {
    this.Link.Link.Position = event.value;
    this.Link.Link.updateDynamicTransform(true);
    this.changeLink.emit(this.link.Link);
  }

  onModelsDropped(event: CdkDragDrop<Model[]>): void {
    if (!this.Link) { return; }
    const m = this.FreeModels[event.previousIndex];
    this.Link.Link.models.push(m);
    m.Parent = this.Link.Link;
    m.parentID = this.Link.Link.ID;
    this.changeLink.emit(this.link.Link);
  }

  onFreeModelsDropped(event: CdkDragDrop<Model[]>): void {
    const m = this.Link.Link.models[event.previousIndex];
    this.Link.Link.models.splice(event.previousIndex);
    m.Parent = undefined;
    m.parentID = undefined;
    m.object.matrixAutoUpdate = false;
    m.object.matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    this.changeLink.emit(this.link.Link);
  }

  public updateMachine(): void {
    this.links = null;
  }

}
