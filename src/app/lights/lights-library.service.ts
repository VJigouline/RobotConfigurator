import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lights } from './lights';
import { LightsLibrary } from './lights-library';
import { Observable, of } from 'rxjs';
import { ErrorDialogComponent } from '../user-controls/error-dialog/error-dialog.component';
import DefaultLibrary from '../../assets/lights/default.json';

@Injectable({
  providedIn: 'root'
})
export class LightsLibraryService {

  private library: LightsLibrary;
  public get Library(): LightsLibrary {
    if (!this.library) { this.library = this.getDefaultLibrary(); }

    return this.library;
  }

  public get currentLights(): Lights {

    if (!this.Library) { return null; }

    if (0 <= this.library.current && this.library.current < this.library.lights.length) {
      return this.library.lights[this.library.current];
    }

    if (this.library.lights.length > 0) {
      this.library.current = 0;
      return this.library.lights[0];
    }

    return null;
  }

  constructor(
    private http: HttpClient
  ) { }

  public getDefaultLibrary(): LightsLibrary {
    const ret = DefaultLibrary as LightsLibrary;
    const lib = new LightsLibrary();
    ret.clone = lib.clone.bind(ret);
    if (ret.current === undefined) { ret.current = 0; }

    return ret.clone();
  }

  public setCurrentLights(lights: Lights) {
    const index = this.Library.lights.indexOf(lights);
    if (index > -1) { this.Library.current = index; }
  }

  public importLibrary(library: LightsLibrary): void {
    if (this.library.lights.length === 0 ||
      this.library.lights.length === 1 && this.library.lights[0].lights.length === 0) {
      this.library = library;
      return;
    }

    for (const lights of library.lights) {
      this.library.lights.push(lights);
    }
  }
}
