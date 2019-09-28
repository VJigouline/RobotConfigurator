import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RobotConfiguratorComponent } from './robot-configurator/robot-configurator.component';
import { RobotViewComponent } from './robot-view/robot-view.component';
import { RobotEditorComponent } from './robot-editor/robot-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    RobotConfiguratorComponent,
    RobotViewComponent,
    RobotEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularSplitModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
