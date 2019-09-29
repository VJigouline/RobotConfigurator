import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Output, Input } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-robot-view',
  templateUrl: './robot-view.component.html',
  styleUrls: ['./robot-view.component.scss']
})
export class RobotViewComponent implements OnInit {

  @ViewChild('container', { static: true })
  container: ElementRef;

  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private hemiLight: THREE.HemisphereLight;
  private floorMat: THREE.MeshStandardMaterial;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  @Input() animate: () => void;

  constructor() { }

  ngOnInit() {
    this.animate = this.Animate;
    this.InitialiseCamera();
    this.InitialiseScene();

    this.Animate();
  }

  private InitialiseScene(): void {
    this.scene = new THREE.Scene();

    this.hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d);
    this.scene.add( this.hemiLight );

    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 0, 1 ).normalize();
    this.scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( -1, 0, 1 ).normalize();
    this.scene.add( light );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( -1, -1, 0 ).normalize();
    this.scene.add( light );

    this.floorMat = new THREE.MeshStandardMaterial( {
      roughness: 0.8,
      color: 0xffffff,
      metalness: 0.2,
      bumpScale: 0.5
    });
    const textureLoader = new THREE.TextureLoader();
    let texture = textureLoader.load( 'assets/textures/hardwood2_diffuse.jpg', map => {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 4, 9.6 );
    } );
    this.floorMat.map = texture;
    this.floorMat.needsUpdate = true;
    texture = textureLoader.load( 'assets/textures/hardwood2_bump.jpg', map => {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 4, 9.6 );
    } );
    this.floorMat.bumpMap = texture;
    this.floorMat.needsUpdate = true;
    texture = textureLoader.load( 'assets/textures/hardwood2_roughness.jpg', map => {
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.RepeatWrapping;
      map.anisotropy = 4;
      map.repeat.set( 4, 9.6 );
    } );
    this.floorMat.roughnessMap = texture;
    this.floorMat.needsUpdate = true;

    const floorGeometry = new THREE.PlaneBufferGeometry( 11000, 10000 );
    const floorMesh = new THREE.Mesh( floorGeometry, this.floorMat );
    floorMesh.receiveShadow = true;
    floorMesh.position.set(0, 0, -500);
    this.scene.add( floorMesh );

    // LoadRobot();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.physicallyCorrectLights = true;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor(0xbbeeff, 1);
    this.container.nativeElement.appendChild( this.renderer.domElement );


    this.controls = new OrbitControls( this.camera, this.renderer.domElement );

    // window.addEventListener( 'resize', onWindowResize, false );

    this.camera.lookAt(this.scene.position);

  }

  private InitialiseCamera(): void {
    this.camera = new THREE.OrthographicCamera( -this.container.nativeElement.offsetWidth * 5,
      this.container.nativeElement.offsetWidth * 5,
      this.container.nativeElement.offsetHeight * 5,
      -this.container.nativeElement.offsetHeight * 5, 1, 100000 );
    this.camera.position.y = -10000;
    this.camera.position.z = 1;
  }

  private Animate(): void {
    //console.log('Animate called.');
    requestAnimationFrame(this.animate.bind(this));
    this.Render();
  }

  private Render(): void {

    this.renderer.render(this.scene, this.camera);
  }
}
