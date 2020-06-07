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
    private transformBase: TransformHelper;
    private transformAttachment: TransformHelper;

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

    public updateHelper(): void {
        this.transformBase.updateHelper();
        this.transformAttachment.updateHelper();
    }

    private create3DObjects(): void {
        let th = new TransformHelper(this.link.baseWorld, 2 * this.helperScale, this.camera);
        this.transformBase = th;
        th.name = 'Base';
        th.parent = this;
        this.children.push(th);
        th = new TransformHelper(this.link.attachmentWorld, 2 * this.helperScale, this.camera);
        this.transformAttachment = th;
        th.name = 'Attachment';
        th.parent = this;
        this.children.push(th);
        switch (this.link.Type) {
            case LinkType.ARM:
                this.createArm();
                break;
            case LinkType.LINEAR_JOINT:
                this.createLinear();
                break;
            case LinkType.STATIC:
                this.createStatic();
                break;
        }
    }

    private createArm(): void {

        const mat = new THREE.MeshPhongMaterial({
            color: 0xa4ac6e,
            specular: 0x111111,
            shininess: 160
        });

    }

    private createLinear(): void {

        const mat = new THREE.MeshPhongMaterial({
            color: 0x70b0a,
            specular: 0,
            shininess: 30
        });

    }

    private createStatic(): void {
        return;
        const box = LinkHelper.box(this.link);
        const centre = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        size.x += 10;
        size.y += 10;
        if (size.x < 100) { size.x = 100; }
        if (size.y < 100) { size.y = 100; }
        if (size.z < 1) { size.z = 1; }

        const mat = new THREE.MeshPhongMaterial({
            color: 0,
            specular: 0x111111,
            shininess: 23
        });

        const g = new THREE.BoxGeometry(size.x, size.y, size.z)
            .translate(centre.x, centre.y, centre.z);
        const b = new THREE.Mesh(g, mat);
        this.children.push(b);
    }
}
