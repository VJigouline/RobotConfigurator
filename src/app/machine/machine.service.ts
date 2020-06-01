import { Injectable } from '@angular/core';
import { ThreeSceneService } from '../three-scene.service';
import { Machine, MachineExport } from './machine';
import { } from '../objects3d/link-helper';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  public machine = new Machine();

  constructor(
    private sceneService: ThreeSceneService
  ) { }

  public importMachine(file: File): void {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      try {
        const m = JSON.parse(fileReader.result as string) as MachineExport;
        this.sceneService.removeMachine(this.machine);
        this.machine = new Machine(m);
        this.sceneService.addMachine(this.machine);
        console.log('Machine imported from ' + file.name);
      } catch (e) {
        console.error('Failure to read machine: ' + e);
      }
    };
    fileReader.onerror = (error) => {
      console.error('Failure to read file: ' + error);
    };

    fileReader.readAsText(file, 'UTF-8');
  }
}
