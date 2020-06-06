import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Transform3 } from '../../geometries/transform3';

@Component({
  selector: 'app-transform-editor',
  templateUrl: './transform-editor.component.html',
  styleUrls: ['./transform-editor.component.scss']
})
export class TransformEditorComponent implements OnInit {

  // events
  @Output() changeTransform = new EventEmitter<Transform3>();

  // properties

  @Input() Label = 'Transform';
  @Input() Transform = new Transform3();

  get enableX(): boolean { return this.lockX; }
  set enableX(value: boolean) {
    this.lockX = value;
    if (this.lockX) {
      this.lockY = false;
      this.lockZ = false;
    }
  }
  get enableY(): boolean { return this.lockY; }
  set enableY(value: boolean) {
    this.lockY = value;
    if (this.lockY) {
      this.lockX = false;
      this.lockZ = false;
    }
  }
  get enableZ(): boolean { return this.lockZ; }
  set enableZ(value: boolean) {
    this.lockZ = value;
    if (this.lockZ) {
      this.lockX = false;
      this.lockY = false;
    }
  }

  private lockX = false;
  private lockY = false;
  private lockZ = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onChange(): void {
    this.changeTransform.emit(this.Transform);
  }

  public onXChange(): void {
    if (this.lockY) {
       this.Transform.copy(Transform3.YX(this.Transform.Origin,
        this.Transform.YVec, this.Transform.XVec));
    } else {
      this.Transform.copy(Transform3.ZX(this.Transform.Origin,
        this.Transform.ZVec, this.Transform.XVec));
    }
    this.changeTransform.emit(this.Transform);
  }

  public onYChange(): void {
    if (this.lockZ) {
      this.Transform.copy(Transform3.ZY(this.Transform.Origin,
        this.Transform.ZVec, this.Transform.YVec));
    } else {
      this.Transform.copy(Transform3.XY(this.Transform.Origin,
        this.Transform.XVec, this.Transform.YVec));
    }
    this.changeTransform.emit(this.Transform);
  }

  public onZChange(): void {
    if (this.lockX) {
      this.Transform.copy(Transform3.XZ(this.Transform.Origin,
        this.Transform.XVec, this.Transform.ZVec));
    } else {
      this.Transform.copy(Transform3.YZ(this.Transform.Origin,
        this.Transform.YVec, this.Transform.ZVec));
    }
    this.changeTransform.emit(this.Transform);
  }

}
