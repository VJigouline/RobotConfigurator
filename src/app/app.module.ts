import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { AngularResizedEventModule } from 'angular-resize-event';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { RobotEditorComponent } from './robot-editor/robot-editor.component';
import { SceneViewComponent } from './scene-view/scene-view.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MachineEditorComponent } from './machine-editor/machine-editor.component';
import { SceneEditorComponent } from './scene-editor/scene-editor.component';
import { MachineModule } from './machine/machine.module';

@NgModule({
  declarations: [
    AppComponent,
    RobotEditorComponent,
    SceneViewComponent,
    MachineEditorComponent,
    SceneEditorComponent
  ],
  imports: [
    AngularSplitModule.forRoot(),
    AngularResizedEventModule,
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    MachineModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
