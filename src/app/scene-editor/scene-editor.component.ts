import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThreeSceneService } from '../three-scene.service';

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
}
