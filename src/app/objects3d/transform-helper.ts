import { Transform3 } from '../geometries/transform3';

import * as THREE from 'three';
import { Point3 } from '../geometries/point3';
import { Vector3 } from '../geometries/vector3';

export class TransformHelper extends THREE.Object3D {

    public transform: Transform3;
    public helperScale = 1;
    private camera: THREE.Camera;

    constructor(transform: Transform3, scale?: number, camera?: THREE.Camera) {
        super();
        this.transform = transform;
        this.helperScale = scale ? scale : 1;
        this.camera = camera;
        this.create3DObjects();
    }

    public static vector(v: Point3 | Vector3): THREE.Vector3 {
        return new THREE.Vector3(v.X, v.Y, v.Z);
    }

    public static matrix(tra: Transform3): THREE.Matrix4 {
        // return new THREE.Matrix4().set(
        //     tra.XVec.X, tra.XVec.Y, tra.XVec.Z, 0,
        //     tra.YVec.X, tra.YVec.Y, tra.YVec.Z, 0,
        //     tra.ZVec.X, tra.ZVec.Y, tra.ZVec.Z, 0,
        //     tra.Origin.X, tra.Origin.Y, tra.Origin.Z, 1
        // );
        return new THREE.Matrix4().set(
            tra.XVec.X, tra.YVec.X, tra.ZVec.X, tra.Origin.X,
            tra.XVec.Y, tra.YVec.Y, tra.ZVec.Y, tra.Origin.Y,
            tra.XVec.Z, tra.YVec.Z, tra.ZVec.Z, tra.Origin.Z,
            0, 0, 0, 1
        );
    }

    private create3DObjects(): void {
        const matOrigin = new THREE.MeshPhongMaterial({
            color: 0xffc900,
            specular: 0x979797,
            shininess: 40
        });
        const matXAxis = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            specular: 0x979797,
            shininess: 7
        });
        const matYAxis = new THREE.MeshPhongMaterial({
            color: 0x8b110,
            specular: 0x979797,
            shininess: 7
        });
        const matZAxis = new THREE.MeshPhongMaterial({
            color: 0x500ff,
            specular: 0x979797,
            shininess: 7
        });

        const sphere = new THREE.SphereGeometry(2 * this.helperScale, 16, 16);
        const meshOrigin = new THREE.Mesh(sphere, matOrigin);
        meshOrigin.parent = this;
        this.children.push(meshOrigin);
        let cylinder = new THREE.CylinderGeometry(this.helperScale, this.helperScale,
            15 * this.helperScale, 16, 1, true)
            .translate(0, 7.5 * this.helperScale, 0)
            .rotateZ(-Math.PI / 2);
        let meshCylinder = new THREE.Mesh(cylinder, matXAxis);
        meshCylinder.parent = this;
        this.children.push(meshCylinder);
        let cone = new THREE.ConeGeometry(2 * this.helperScale, 10 * this.helperScale, 16)
            .translate(0, 20 * this.helperScale, 0)
            .rotateZ(-Math.PI / 2);
        let meshCone = new THREE.Mesh(cone, matXAxis);
        meshCone.parent = this;
        this.children.push(meshCone);

        cylinder = new THREE.CylinderGeometry(this.helperScale, this.helperScale,
            15 * this.helperScale, 16, 1, true)
            .translate(0, 7.5 * this.helperScale, 0);
        meshCylinder = new THREE.Mesh(cylinder, matYAxis);
        meshCylinder.parent = this;
        this.children.push(meshCylinder);
        cone = new THREE.ConeGeometry(2 * this.helperScale, 10 * this.helperScale, 16)
            .translate(0, 20 * this.helperScale, 0);
        meshCone = new THREE.Mesh(cone, matYAxis);
        meshCone.parent = this;
        this.children.push(meshCone);

        cylinder = new THREE.CylinderGeometry(this.helperScale, this.helperScale,
            15 * this.helperScale, 16, 1, true)
            .translate(0, 7.5 * this.helperScale, 0)
            .rotateX(Math.PI / 2);
        meshCylinder = new THREE.Mesh(cylinder, matZAxis);
        meshCylinder.parent = this;
        this.children.push(meshCylinder);
        cone = new THREE.ConeGeometry(2 * this.helperScale, 10 * this.helperScale, 16)
            .translate(0, 20 * this.helperScale, 0)
            .rotateX(Math.PI / 2);
        meshCone.parent = this;
        meshCone = new THREE.Mesh(cone, matZAxis);
        meshCone.parent = this;
        this.children.push(meshCone);

        this.matrixAutoUpdate = false;
        this.matrix = TransformHelper.matrix(this.transform);
        this.matrixWorld = this.matrix;
        this.matrixWorldNeedsUpdate = true;

        this.updateMatrixWorld();
    }

    public updateMatrixWorld(): void {
        super.updateMatrixWorld();

        if (!this.camera) { return; }

        let factor: number;
        if ( (this.camera as THREE.OrthographicCamera).isOrthographicCamera ) {
            const orthoCam = this.camera as THREE.OrthographicCamera;
            factor = ( orthoCam.top - orthoCam.bottom ) / orthoCam.zoom;
        } else {
            const perspectiveCam = this.camera as THREE.PerspectiveCamera;
            factor = this.position.distanceTo(
                perspectiveCam.position ) * Math.min(
                1.9 * Math.tan( Math.PI * perspectiveCam.fov / 360 ) / perspectiveCam.zoom, 7 );
        }

        for (const c of this.children) {
            c.scale.set( 1, 1, 1 ).multiplyScalar( factor * this.helperScale / 1000 );
        }
    }
}
