import { LinkType, LinkState} from './link-type.enum';
import { Transform3 } from '../geometries/transform3';
import { LinkHelper } from '../objects3d/link-helper';
import { v4 as uuid } from 'uuid';

import * as THREE from 'three';

export class LinkExport {
    public ID: string;
    public Name: string;
    public Type: LinkType;
    public State: LinkState;
    public Base: number[];
    public Attachment: number[];
    public Model: string;
    public Home: number;
    public Minimum: number;
    public Maximum: number;
    public Position: number;
    public Offset: number;
    public Weight: number;
    public Direction: number[];

    constructor(link: Link) {
        if (link.ID) { this.ID = link.ID; }
        if (link.Name) { this.Name = link.Name; }
        if (link.Type) { this.Type = link.Type; }
        if (link.State) { this.State = link.State; }
        if (link.Base) { this.Base = link.Base.toArray(); }
        if (link.Attachment) { this.Attachment = link.Attachment.toArray(); }
        if (link.Home) { this.Home = link.Home; }
        if (link.Minimum) { this.Minimum = link.Minimum; }
        if (link.Maximum) { this.Maximum = link.Maximum; }
        if (link.Position) { this.Position = link.Position; }
        if (link.Offset) { this.Offset = link.Offset; }
        if (link.Weight) { this.Weight = link.Weight; }
        if (link.Direction) { this.Direction = link.Direction; }
    }
}

export class Link {
    public ID = uuid().toString();
    public Name: string;
    public Type = LinkType.STATIC;
    public State = LinkState.STATIC;
    public Base = new Transform3();
    public Attachment = new Transform3();
    public Model: string;
    public Home: number;
    public Minimum: number;
    public Maximum: number;
    public Position: number;
    public Offset: number;
    public Weight: number;
    public Direction: number[];

    public get Parent(): Link { return this.parent; }
    public set Parent(value: Link) { this.parent = value; }
    public get Children(): Link[] { return this.children; }
    public set Children(value: Link[]) { this.children = value; }

    public defaultObject: LinkHelper;

    public get TypeName(): string {

        switch (this.Type) {
            case LinkType.ARM: return 'arm';
            case LinkType.BALL_JOINT: return 'ball';
            case LinkType.HEXAPOD: return 'hexapod';
            case LinkType.LINEAR_JOINT: return 'linear';
            case LinkType.PIVOT_JOINT: return 'pivot';
            case LinkType.STATIC: return 'static';
            case LinkType.TRIPOD: return 'tripod';
            case LinkType.UNIVERSAL_JOINT: return 'universal';
        }

        return 'static';
    }

    private parent: Link;
    private children = new Array<Link>();

    constructor(link?: Link) {
        if (!link) { return; }
        this.copy(link);
    }

    public copy(link: Link) {
        if (link.ID) { this.ID = link.ID; }
        if (link.Name) { this.Name = link.Name; }
        if (link.Type) { this.Type = link.Type; }
        if (link.State) { this.State = link.State; }
        if (link.Base) {
            if (Array.isArray(link.Base)) {
                this.Base = Transform3.fromArray(link.Base);
            } else {
                this.Base = link.Base;
            }
        }
        if (link.Attachment) {
            if (Array.isArray(link.Attachment)) {
                this.Attachment = Transform3.fromArray(link.Attachment);
            } else {
                this.Attachment = link.Attachment;
            }
        }
        if (link.Model) { this.Model = link.Model; }
        if (link.Home) { this.Home = link.Home; }
        if (link.Minimum) { this.Minimum = link.Minimum; }
        if (link.Maximum) { this.Maximum = link.Maximum; }
        if (link.Position) { this.Position = link.Position; }
        if (link.Offset) { this.Offset = link.Offset; }
        if (link.Weight) { this.Weight = link.Weight; }
        if (link.Direction) { this.Direction = link.Direction; }
        if (link.parent) { this.parent = link.parent; }
        if (link.children) { this.children = link.children; }
    }

    public toJSON(): LinkExport {
        return new LinkExport(this);
    }
}
