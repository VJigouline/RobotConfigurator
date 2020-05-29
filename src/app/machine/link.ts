import { LinkType, LinkState} from './link-type.enum';
import { Matrix4 } from '../geometries/matrix4';
import { v4 as uuid } from 'uuid';

export class Link {
    public ID = uuid().toString();
    public Name: string;
    public Type = LinkType.STATIC;
    public State = LinkState.DYNAMIC;
    public Base = new Matrix4();
    public Attachment = new Matrix4();
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
        if (link.Base) { this.Base = link.Base; }
        if (link.Attachment) { this.Attachment = link.Attachment; }
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
}
