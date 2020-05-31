import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LinkEditorComponent } from './link-editor/link-editor.component';

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



@NgModule({
  declarations: [LinkEditorComponent],
  imports: [
    CommonModule,
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
  ],
  exports: [
    LinkEditorComponent
  ]
})
export class MachineModule { }
