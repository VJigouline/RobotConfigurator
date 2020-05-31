import { Component, OnInit } from '@angular/core';
import { Link } from '../link';
import { MachineService } from '../machine.service';
import { Machine } from '../machine';
import { MatSelectChange } from '@angular/material/select';
import { LinkType } from '../link-type.enum';

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

  constructor(
    public machineService: MachineService
  ) { }

  ngOnInit(): void {
  }

  onSelectionChange(change: MatSelectChange): void {
  }

}
