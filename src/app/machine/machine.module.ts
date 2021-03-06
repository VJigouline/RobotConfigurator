import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkEditorComponent } from './link-editor/link-editor.component';
import { UserControlsModule } from '../user-controls/user-controls.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { MachineControlsComponent } from './machine-controls/machine-controls.component';
import { MachineControlComponent } from './machine-control/machine-control.component';



@NgModule({
  declarations: [LinkEditorComponent, MachineControlsComponent, MachineControlComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatCheckboxModule,
    MatSliderModule,
    ReactiveFormsModule,
    UserControlsModule
  ],
  exports: [
    LinkEditorComponent,
    MachineControlsComponent
  ]
})
export class MachineModule { }
