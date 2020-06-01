import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformEditorComponent } from './transform-editor.component';

describe('TransformEditorComponent', () => {
  let component: TransformEditorComponent;
  let fixture: ComponentFixture<TransformEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransformEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
