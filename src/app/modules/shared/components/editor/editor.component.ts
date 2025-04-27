import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators, Editor, Toolbar, toDoc, toHTML, schema } from 'ngx-editor';

import jsonDoc from './doc';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorComponent implements OnInit, OnDestroy{
  
  @Input() content: any;
  @Input() placeholder = 'Write something...';
  @Output() contentChange = new EventEmitter<string>();

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form!: FormGroup;
  jsonDoc: any;

  ngOnInit(): void {
    this.jsonDoc = JSON.parse(this.content)//toDoc(this.content, schema);
    console.log(this.jsonDoc);
    this.form = new FormGroup({
      editorContent: new FormControl(
        { value: this.jsonDoc, disabled: false },
        Validators.required()
      ),
    });

    this.editor = new Editor();

    this.form.get('editorContent')?.valueChanges.subscribe((value: any) => {
      console.log(value);
      let _value = JSON.stringify(value);//toHTML(value, schema);
      this.content = _value;
      this.contentChange.emit(_value || undefined);
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}