import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThreeSceneService } from '../three-scene.service';

import * as THREE from 'three';

@Component({
  selector: 'app-scene-editor',
  templateUrl: './scene-editor.component.html',
  styleUrls: ['./scene-editor.component.scss']
})
export class SceneEditorComponent implements OnInit {

  @Output() sceneChanged = new EventEmitter<string>();

  constructor(
    private sceneService: ThreeSceneService,
  ) { }

  ngOnInit() {
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
}
