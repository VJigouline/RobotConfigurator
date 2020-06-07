import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThreeSceneService } from '../three-scene.service';
import { MaterialLibraryService } from '../materials/material-library.service';

import * as THREE from 'three';
import { Materials } from '../materials/materials';
import { Material } from '../materials/material';
import { MatSelectChange } from '@angular/material/select';
import { DragControls, DragEvent } from 'three/examples/jsm/controls/DragControls';
import { Model } from '../machine/link';
import { BufferAttribute } from 'three';

interface UVs {
  uv0: THREE.Vector2;
  uv1: THREE.Vector2;
  uv2: THREE.Vector2;
}

@Component({
  selector: 'app-scene-editor',
  templateUrl: './scene-editor.component.html',
  styleUrls: ['./scene-editor.component.scss']
})
export class SceneEditorComponent implements OnInit {

  @Output() sceneChanged = new EventEmitter<string>();

  get MaterialSets(): Materials[] {
    return this.libraryService.Library.materials;
  }
  set MaterialSets(value: Materials[]) {}
  get Materials(): Materials {
    return this.libraryService.currentMaterials;
  }
  set Materials(value: Materials) {}
  public get Material(): Material {
    if (!this.material) { this.material = this.Materials.materials[0]; }
    return this.material;
  }
  public set Material(value: Material) { this.material = value; }
  private material: Material;
  private activeTab = false;
  private updateDragControl = true;
  private dragControl: DragControls;
  private selectedObject: THREE.Object3D;
  private highlightedObject: THREE.Object3D;
  private selectedObjectMaterial: THREE.Material | THREE.Material[];
  private highlightedObjectMaterial: THREE.Material | THREE.Material[];
  private selectedMaterial: THREE.Material;
  private highlightedMaterial: THREE.Material;
  private doHighlighting = true;

  constructor(
    private sceneService: ThreeSceneService,
    private libraryService: MaterialLibraryService
  ) { }

  ngOnInit() {
    this.material = this.Materials.materials[0];
    this.highlightedMaterial = new THREE.MeshStandardMaterial( {
      color: '#ff00ff', metalness: 1, roughness: 0.5, name: 'Highlight',
      transparent: true, opacity: 0.5
     } );
    this.selectedMaterial = new THREE.MeshStandardMaterial( {
      color: '#ffff00', metalness: 1, roughness: 0.5, name: 'Highlight',
      transparent: true, opacity: 0.5
     } );
 }

  public onNewScene(): void {
    this.sceneChanged.emit('new');
  }

  public onAddToScene(): void {
    this.sceneChanged.emit('add');
  }

  public onUpdateScene(): void {
    this.sceneChanged.emit('update');
  }

  onMinusX(): void {
    this.setCameraDirection('-X', new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1));
  }

  onPlusX(): void {
    this.setCameraDirection('+X', new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 1));
  }

  onMinusY(): void {
    this.setCameraDirection('-Y', new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, 1));
  }

  onPlusY(): void {
    this.setCameraDirection('+Y', new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1));
  }

  onMinusZ(): void {
    this.setCameraDirection('-Z', new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0));
  }

  onPlusZ(): void {
    this.setCameraDirection('-Z', new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, -1, 0));
  }

  private setCameraDirection(name: string, direction: THREE.Vector3, up: THREE.Vector3): void {
    const c = this.sceneService.camera;
    const oc = this.sceneService.orbitControls;
    const sphere = new THREE.Sphere();
    this.sceneService.getSceneBox().getBoundingSphere(sphere);
    const centre = sphere.center;
    const radius = sphere.radius;
    const pos = direction.multiplyScalar(-1.5 * radius).add(centre);
    const f = 1.5;
    c.far = 2 * f * radius;
    c.near = 0.1 * radius;
    c.position.set(pos.x, pos.y, pos.z);
    c.up.set(up.x, up.y, up.z);
    oc.target.set(centre.x, centre.y, centre.z);
    oc.update();
    this.sceneChanged.emit(name);
  }

  public onSelectionChange(change: MatSelectChange): void {
    for (let i = 0; i < this.libraryService.Library.materials.length; ++i) {
      if (this.libraryService.Library.materials[i] === change.value) {
        this.libraryService.Library.current = i;
        this.material = null;
        break;
      }
    }
  }

  onSelectedTabChange(index: number) {
    if (index === 3) {
      this.activeTab = true;
      this.setDragControl();
    } else {
      this.updateDragControl = true;
      this.removeDragControl();
      this.removeHighlighting();
      this.removeSelection();
      this.activeTab = false;
    }
  }

  public setDragControl(force = false): void {
    if (!this.activeTab) {
      this.updateDragControl = true;
      return;
    }
    if (force) { this.updateDragControl = true; }
    if (!this.updateDragControl) { return; }
    this.dragControl = this.sceneService.getDragControl(
      this.sceneService.getSelectableObjects()
    );
    this.dragControl.enabled = false;
    this.dragControl.addEventListener('hoveron',
      this.onDragHoveron.bind(this));
    this.dragControl.addEventListener('hoveroff',
      this.onDragHoveroff.bind(this));
    this.dragControl.addEventListener('dragstart',
      this.onDragStart.bind(this));
    this.dragControl.addEventListener('drag',
      this.onDragStart.bind(this));
    this.updateDragControl = false;
  }

  private removeDragControl(): void {
    if (this.dragControl) {
      this.dragControl.enabled = false;
      this.dragControl.deactivate();
      delete this.dragControl;
      this.dragControl = null;
    }
  }

  private removeHighlighting(): void {
    if (this.highlightedObject) {
      if (this.highlightedObject instanceof THREE.Mesh) {
        const mesh = this.highlightedObject as THREE.Mesh;
        mesh.material = this.highlightedObjectMaterial;
        this.highlightedObjectMaterial = null;
        this.highlightedObject = null;
      }
    }
  }

  private removeSelection(): void {
    if (this.selectedObject) {
      if (this.selectedObject instanceof THREE.Mesh) {
        const mesh = this.selectedObject as THREE.Mesh;
        mesh.material = this.selectedObjectMaterial;
        this.selectedObjectMaterial = null;
        this.selectedObject = null;
      }
    }
  }

  private onDragHoveron(event: DragEvent): void {
    if (event.event.altKey) { return; }
    this.removeHighlighting();
    if (event.object instanceof THREE.Mesh && this.doHighlighting) {
      const mesh = event.object as THREE.Mesh;
      if (mesh !== this.selectedObject) {
        this.highlightedObject = mesh;
        this.highlightedObjectMaterial = mesh.material;
        mesh.material = this.highlightedMaterial;
      }
    }
    this.sceneChanged.emit('redraw');
  }

  private onDragHoveroff(event: DragEvent): void {
    this.removeHighlighting();
    this.sceneChanged.emit('redraw');
  }

  private onDragStart(event: DragEvent): void {
    if (event.event.button !== 0 || event.event.altKey) { return; }
    this.removeSelection();
    this.removeHighlighting();
    if (event.object instanceof THREE.Mesh) {
      this.selectMesh(event.object as THREE.Mesh, event.event.ctrlKey);
    }
    this.sceneChanged.emit('redraw');
  }

  private selectMesh(mesh: THREE.Mesh, assign: boolean): void {
    this.selectedObject = mesh;
    // this.generateMissingUVs(mesh, true);
    this.selectedObjectMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (this.Material && assign) {
      mesh.material = this.Material.material;
      this.selectedObjectMaterial = mesh.material;
      const m = (mesh.userData as Model);
      if (m) { m.Material = this.material.name; }
      this.sceneChanged.emit('redraw');
    }
  }

  private generateMissingUVs(mesh: THREE.Mesh, first: boolean) {
    if (!(mesh.geometry instanceof THREE.BufferGeometry)) { return; }
    const g = mesh.geometry as THREE.BufferGeometry;
    if (g.attributes.uv) { return; }

    // find out the dimensions, to let texture size 100% fit without stretching
    g.computeBoundingBox();
    const bboxSize = g.boundingBox.getSize(new THREE.Vector3());
    const uvMapSize = Math.min(bboxSize.x, bboxSize.y, bboxSize.z);

    // calculate UV coordinates, if uv attribute is not present, it will be added
    this.applyBoxUV(g, new THREE.Matrix4(), uvMapSize);

    // let three.js know
    (g.attributes.uv as THREE.BufferAttribute).needsUpdate = true;

    if (!first) { return; }
    const objects = this.sceneService.getSelectableObjects();
    for (const o of objects) {
      if (!(o instanceof THREE.Mesh)) { continue; }
      this.generateMissingUVs(o as THREE.Mesh, false);
    }
  }

  private _applyBoxUV(geom: THREE.BufferGeometry, transformMatrix: THREE.Matrix4,
                      bbox: THREE.Box3, bboxMaxSize: number) {

    const coords = new Array<number>();
    coords.length = 2 * geom.attributes.position.array.length / 3;

    // geom.removeAttribute('uv');
    // if (geom.attributes.uv === undefined) {
    //     geom.setAttribute('uv', new THREE.Float32BufferAttribute(coords, 2));
    // }

    // maps 3 verts of 1 face on the better side of the cube
    // side of the cube can be XY, XZ or YZ
    const makeUVs = (v0: THREE.Vector3, v1: THREE.Vector3, v2: THREE.Vector3): UVs => {

        // pre-rotate the model so that cube sides match world axis
        v0.applyMatrix4(transformMatrix);
        v1.applyMatrix4(transformMatrix);
        v2.applyMatrix4(transformMatrix);

        // get normal of the face, to know into which cube side it maps better
        const n = new THREE.Vector3();
        n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();

        n.x = Math.abs(n.x);
        n.y = Math.abs(n.y);
        n.z = Math.abs(n.z);

        const uv0 = new THREE.Vector2();
        const uv1 = new THREE.Vector2();
        const uv2 = new THREE.Vector2();
        // xz mapping
        if (n.y > n.x && n.y > n.z) {
            uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
            uv0.y = (bbox.max.z - v0.z) / bboxMaxSize;

            uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
            uv1.y = (bbox.max.z - v1.z) / bboxMaxSize;

            uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
            uv2.y = (bbox.max.z - v2.z) / bboxMaxSize;
        } else
        if (n.x > n.y && n.x > n.z) {
            uv0.x = (v0.z - bbox.min.z) / bboxMaxSize;
            uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

            uv1.x = (v1.z - bbox.min.z) / bboxMaxSize;
            uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

            uv2.x = (v2.z - bbox.min.z) / bboxMaxSize;
            uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
        } else
        if (n.z > n.y && n.z > n.x) {
            uv0.x = (v0.x - bbox.min.x) / bboxMaxSize;
            uv0.y = (v0.y - bbox.min.y) / bboxMaxSize;

            uv1.x = (v1.x - bbox.min.x) / bboxMaxSize;
            uv1.y = (v1.y - bbox.min.y) / bboxMaxSize;

            uv2.x = (v2.x - bbox.min.x) / bboxMaxSize;
            uv2.y = (v2.y - bbox.min.y) / bboxMaxSize;
        }

        return { uv0, uv1, uv2 };
    };

    if (geom.index) { // is it indexed buffer geometry?
        for (let vi = 0; vi < geom.index.array.length; vi += 3) {
            const idx0 = geom.index.array[vi];
            const idx1 = geom.index.array[vi + 1];
            const idx2 = geom.index.array[vi + 2];

            const vx0 = geom.attributes.position.array[3 * idx0];
            const vy0 = geom.attributes.position.array[3 * idx0 + 1];
            const vz0 = geom.attributes.position.array[3 * idx0 + 2];

            const vx1 = geom.attributes.position.array[3 * idx1];
            const vy1 = geom.attributes.position.array[3 * idx1 + 1];
            const vz1 = geom.attributes.position.array[3 * idx1 + 2];

            const vx2 = geom.attributes.position.array[3 * idx2];
            const vy2 = geom.attributes.position.array[3 * idx2 + 1];
            const vz2 = geom.attributes.position.array[3 * idx2 + 2];

            const v0 = new THREE.Vector3(vx0, vy0, vz0);
            const v1 = new THREE.Vector3(vx1, vy1, vz1);
            const v2 = new THREE.Vector3(vx2, vy2, vz2);

            const uvs = makeUVs(v0, v1, v2);

            coords[2 * idx0] = uvs.uv0.x;
            coords[2 * idx0 + 1] = uvs.uv0.y;

            coords[2 * idx1] = uvs.uv1.x;
            coords[2 * idx1 + 1] = uvs.uv1.y;

            coords[2 * idx2] = uvs.uv2.x;
            coords[2 * idx2 + 1] = uvs.uv2.y;
        }
    } else {
        for (let vi = 0; vi < geom.attributes.position.array.length; vi += 9) {
          const vx0 = geom.attributes.position.array[vi];
          const vy0 = geom.attributes.position.array[vi + 1];
          const vz0 = geom.attributes.position.array[vi + 2];

          const vx1 = geom.attributes.position.array[vi + 3];
          const vy1 = geom.attributes.position.array[vi + 4];
          const vz1 = geom.attributes.position.array[vi + 5];

          const vx2 = geom.attributes.position.array[vi + 6];
          const vy2 = geom.attributes.position.array[vi + 7];
          const vz2 = geom.attributes.position.array[vi + 8];

          const v0 = new THREE.Vector3(vx0, vy0, vz0);
          const v1 = new THREE.Vector3(vx1, vy1, vz1);
          const v2 = new THREE.Vector3(vx2, vy2, vz2);

          const uvs = makeUVs(v0, v1, v2);

          const idx0 = vi / 3;
          const idx1 = idx0 + 1;
          const idx2 = idx0 + 2;

          coords[2 * idx0] = uvs.uv0.x;
          coords[2 * idx0 + 1] = uvs.uv0.y;

          coords[2 * idx1] = uvs.uv1.x;
          coords[2 * idx1 + 1] = uvs.uv1.y;

          coords[2 * idx2] = uvs.uv2.x;
          coords[2 * idx2 + 1] = uvs.uv2.y;
        }
    }

    geom.deleteAttribute('uv');
    if (geom.attributes.uv === undefined) {
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(coords, 2));
  }
  // geom.attributes.uv.array = new Float32Array(coords);
}

private applyBoxUV(bufferGeometry: THREE.BufferGeometry, transformMatrix: THREE.Matrix4, boxSize: number) {

    if (transformMatrix === undefined) {
        transformMatrix = new THREE.Matrix4();
    }

    if (boxSize === undefined) {
      const geom = bufferGeometry;
      geom.computeBoundingBox();
      const bbox = geom.boundingBox;

      const bboxSizeX = bbox.max.x - bbox.min.x;
      const bboxSizeZ = bbox.max.z - bbox.min.z;
      const bboxSizeY = bbox.max.y - bbox.min.y;

      boxSize = Math.max(bboxSizeX, bboxSizeY, bboxSizeZ);
    }

    const uvBbox = new THREE.Box3(
      new THREE.Vector3(-boxSize / 2, -boxSize / 2, -boxSize / 2),
      new THREE.Vector3(boxSize / 2, boxSize / 2, boxSize / 2)
      );

    this._applyBoxUV(bufferGeometry, transformMatrix, uvBbox, boxSize);
  }
}
