import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Material } from '../materials/material';
import { SceneViewComponent } from '../scene-view/scene-view.component';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { ThreeSceneService } from '../three-scene.service';
import { ResizedEvent } from 'angular-resize-event';
import { Light } from '../lights/light';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MachineService } from '../machine/machine.service';
import { Link } from '../machine/link';

@Component({
  selector: 'app-robot-editor',
  templateUrl: './robot-editor.component.html',
  styleUrls: ['./robot-editor.component.scss']
})
export class RobotEditorComponent implements OnInit, AfterViewInit {

  @Input() Width: number;
  @Input() Height: number;

  ViewHeight = 100;
  ViewWidth = 100;

  @ViewChild('ThreeJSView')
  private threeView: SceneViewComponent;

  constructor(
    private sceneService: ThreeSceneService,
    private machineService: MachineService,
    private elRef: ElementRef
    ) { }

  ngOnInit() {
    this.Width = this.elRef.nativeElement.width;
    this.Height = this.elRef.nativeElement.height;
  }

  public onResized(event: ResizedEvent): void {
    // console.log(`editor OnResize. New width: ${event.newWidth}, new height: ${event.newHeight}`);
    this.Width = event.newWidth;
    this.Height = event.newHeight;
    this.threeView.AreaHeight = event.newHeight;
    this.threeView.setCameraSize(this.threeView.AreaWidth, this.threeView.AreaHeight);
    this.sceneService.renderer.setSize(this.threeView.AreaWidth, this.threeView.AreaHeight - 4);
  }

  ngAfterViewInit(): void {
    this.Width = this.elRef.nativeElement.width;
    this.Height = this.elRef.nativeElement.height;
  }

  onMaterialChange(material: Material) {
    if (!this.threeView) { return; }
    this.threeView.Render();
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.sceneService.addFiles(this.readLibraries(files), this.ResetScene.bind(this));
  }

  private readLibraries(files: NgxFileDropEntry[]): NgxFileDropEntry[] {
    const ret = new Array<NgxFileDropEntry>();

    for (const f of files) {
      if (f.fileEntry.isFile) {
        const fileExtension = f.relativePath.split('.').pop().toLocaleLowerCase();
        switch (fileExtension) {
          case 'matlib':
            (f.fileEntry as FileSystemFileEntry).file((file: File) => {
              console.error('Implementation required.');
              // this.materialEditor.importLibrary(file);
            });
            break;
          case 'ltslib':
            (f.fileEntry as FileSystemFileEntry).file((file: File) => {
              console.error('Implementation required.');
              // this.lightsLirbaryEditor.importLibrary(file);
            });
            break;
          case 'mcf':
            (f.fileEntry as FileSystemFileEntry).file((file: File) => {
              this.machineService.importMachine(file);
            });
            break;
          default:
            ret.push(f);
            break;
        }
      } else {
        ret.push(f);
      }
    }

    return ret;
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

  public onSceneChange(op: string) {
    switch (op) {
      case 'new':
          this.threeView.newScene();
          this.threeView.Render();
          break;
      case 'update':
        this.threeView.UpdateScene();
        break;
    }
  }

  public ResetScene(): void {
    this.sceneService.rescaleScene();
    this.threeView.Render();
  }

  public onLightChanged(light: Light): void {
    if (!this.threeView) { return; }
    this.threeView.Render();
  }

  public onSelectedTabChange(event: MatTabChangeEvent): void {
  }

  onChangeLink(event: Link): void {
    event.updateDynamicTransform(true);
    event.updateModels();
    this.threeView.Render();
  }
}
