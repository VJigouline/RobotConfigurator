import { LinkType, LinkState} from './link-type.enum';
import { Transform3 } from '../geometries/transform3';
import { Vector3 } from '../geometries/vector3';
import { LinkHelper } from '../objects3d/link-helper';
import { v4 as uuid } from 'uuid';
import * as THREE from 'three';

export class ModelExport {
    Parent: string;
    ID: string;
    Material: string;

    constructor(model: Model) {
        if (model.Parent) { this.Parent = model.Parent.ID; }
        if (model.ID) { this.ID = model.ID; }
        if (model.Material) { this.Material = model.Material; }
    }
}

export class Model {
    Parent: Link;
    ID: string;
    Material: string;
    object: THREE.Object3D;
    parentID: string;

    constructor(model?: ModelExport) {
        if (!model) { return; }
        if (model.ID) { this.ID = model.ID; }
        if (model.Material) { this.Material = model.Material; }
        if (model.Parent) { this.parentID = model.Parent; }
    }
}

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
        const t = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.ID = link.ID ? link.ID : uuid().toString();
        if (link.Name) { this.Name = link.Name; }
        this.Type = link.Type ? link.Type : LinkType.STATIC;
        if (link.State) { this.State = link.State; }
        this.Base = link.Base ? link.Base.toArray() : t;
        this.Attachment = link.Attachment ? link.Attachment.toArray() : t;
        if (link.Home) { this.Home = link.Home; }
        if (link.Minimum) { this.Minimum = link.Minimum; }
        if (link.Maximum) { this.Maximum = link.Maximum; }
        if (link.Position) { this.Position = link.Position; }
        if (link.Offset) { this.Offset = link.Offset; }
        if (link.Weight) { this.Weight = link.Weight; }
        if (link.Direction) {
            this.Direction = [link.Direction.X, link.Direction.Y, link.Direction.Z];
        }
    }
}

export class Link {
    public ID = uuid().toString();
    public Name: string;
    public Type = LinkType.STATIC;
    public State: LinkState;
    public Base = new Transform3();
    public Attachment = new Transform3();
    public Home: number;
    public Minimum: number;
    public Maximum: number;
    public Position: number;
    public Offset: number;
    public Weight: number;
    public Direction: Vector3;

    public get Parent(): Link { return this.parent; }
    public set Parent(value: Link) { this.parent = value; }
    public get Children(): Link[] { return this.children; }
    public set Children(value: Link[]) { this.children = value; }

    public defaultObject: LinkHelper;
    public models = new Array<Model>();

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

    public baseWorld = new Transform3();
    public attachmentWorld = new Transform3();

    private parent: Link;
    private children = new Array<Link>();
    private dynamicTransform = new Transform3();

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
                this.Base = link.Base.clone();
            }
        }
        if (link.Attachment) {
            if (Array.isArray(link.Attachment)) {
                this.Attachment = Transform3.fromArray(link.Attachment);
            } else {
                this.Attachment = link.Attachment.clone();
            }
        }
        if (link.Home) { this.Home = link.Home; }
        if (link.Minimum) { this.Minimum = link.Minimum; }
        if (link.Maximum) { this.Maximum = link.Maximum; }
        if (link.Position) { this.Position = link.Position; }
        if (link.Offset) { this.Offset = link.Offset; }
        if (link.Weight) { this.Weight = link.Weight; }
        if (link.Direction) {
            if (Array.isArray(link.Direction)) {
                const d = link.Direction;
                this.Direction = new Vector3(d[0], d[1], d[2]);
            } else {
                this.Direction = link.Direction.clone();
            }
        } else {
            this.Direction = this.defaultDirection();
        }
        if (link.parent) { this.parent = link.parent; }
        if (link.children) { this.children = link.children; }
    }

    public defaultDirection(): Vector3 {

        switch (this.Type) {
            case LinkType.LINEAR_JOINT:
                return Vector3.DirX;
            case LinkType.STATIC:
                return undefined;
        }

        return Vector3.DirZ;
    }

    public updateDynamicTransform(world: boolean): void {
        switch (this.Type) {
            case LinkType.ARM:
                this.updateArmTransform();
                break;
            case LinkType.LINEAR_JOINT:
                this.updateLinearTransform();
                break;
            case LinkType.STATIC:
                break;
            default:
                console.error(`Link type ${this.Type} is not supported.`);
                break;
        }

        this.Children.forEach(element => {
            element.updateDynamicTransform(false);
        });

        if (world) { this.updateWorldTransforms(); }
    }

    private updateWorldTransforms(): void {
        if (this.Parent) {
            this.baseWorld.copy(this.Parent.attachmentWorld.clone()
            .multiply(this.dynamicTransform).multiply(this.Base.Inverted));
        } else {
            this.baseWorld.copy(this.dynamicTransform.clone().multiply(this.Base.Inverted));
        }
        this.attachmentWorld = this.baseWorld.clone().multiply(this.Attachment).multiply(this.Base.Inverted);

        this.Children.forEach(element => {
            element.updateWorldTransforms();
        });
    }

    private updateArmTransform(): void {
        this.dynamicTransform.copy(Transform3.Rotation(
            this.Direction.X, this.Direction.Y, this.Direction.Z,
            Math.PI * (this.Position + (this.Offset ? this.Offset : 0)) / 180));
    }

    private updateLinearTransform(): void {
        const v = this.Direction.clone().multiply(this.Position + (this.Offset ? this.Offset : 0));
        this.dynamicTransform.copy(Transform3.Translation(v.X, v.Y, v.Z));
    }

    public toJSON(): LinkExport {
        return new LinkExport(this);
    }

    public updateModels(): void {
        this.defaultObject.updateHelper();
        for (const m of this.models) {
            if (!m.object) { continue; }
            m.object.matrixAutoUpdate = false;
            const tra = this.baseWorld;
            m.object.matrix.set(
                tra.XVec.X, tra.YVec.X, tra.ZVec.X, tra.Origin.X,
                tra.XVec.Y, tra.YVec.Y, tra.ZVec.Y, tra.Origin.Y,
                tra.XVec.Z, tra.YVec.Z, tra.ZVec.Z, tra.Origin.Z,
                0, 0, 0, 1
            );
        }
    }
}
