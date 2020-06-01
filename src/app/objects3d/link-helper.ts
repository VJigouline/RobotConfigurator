import { Link } from '../machine/link';
import { TransformHelper } from './transform-helper';

import * as THREE from 'three';
import { LinkType } from '../machine/link-type.enum';
import { Point3 } from '../geometries/point3';
import { Vector3 } from '../geometries/vector3';

export class LinkHelper extends THREE.Object3D {

    public link: Link;
    public helperScale = 1;
    private camera: THREE.Camera;

    constructor(link: Link, scale?: number, camera?: THREE.Camera) {
        super();
        this.link = link;
        this.helperScale = scale ? scale : 1;
        this.camera = camera;
        this.name = link.ID;
        this.create3DObjects();
    }

    private static box(link: Link): THREE.Box3 {
        switch (link.Type) {
            case LinkType.ARM:
                return this.boxArm(link);
            case LinkType.LINEAR_JOINT:
                return this.boxLinear(link);
            case LinkType.STATIC:
                return this.boxStatic(link);
        }

        return null;
    }

    private static boxArm(link: Link): THREE.Box3 {
        const ret = new THREE.Box3(TransformHelper.vector(link.Base.Origin),
        TransformHelper.vector(link.Attachment.Origin));

        return ret;
    }

    private static boxLinear(link: Link): THREE.Box3 {
        const ret = new THREE.Box3(TransformHelper.vector(link.Base.Origin),
        TransformHelper.vector(link.Attachment.Origin));

        return ret;
    }

    private static boxStatic(link: Link): THREE.Box3 {
        const ret = new THREE.Box3(TransformHelper.vector(link.Base.Origin),
        TransformHelper.vector(link.Attachment.Origin));

        return ret;
    }

    private create3DObjects(): void {
        let th = new TransformHelper(this.link.Base, 2 * this.helperScale, this.camera);
        th.name = 'Base';
        th.parent = this;
        this.children.push(th);
        th = new TransformHelper(this.link.Attachment, 2 * this.helperScale, this.camera);
        th.name = 'Attachment';
        th.parent = this;
        this.children.push(th);
        switch (this.link.Type) {
            case LinkType.ARM:
                break;
            case LinkType.LINEAR_JOINT:
                break;
            case LinkType.STATIC:
                break;
        }
    }

    private createArm(): void {

    }

    private createLinear(): void {

    }

    private createStatic(): void {

    }
}
