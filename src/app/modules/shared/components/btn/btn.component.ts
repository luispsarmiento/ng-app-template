import { Component, OnInit, Input } from '@angular/core';

class BtnColor{
  static readonly SUCCESS = 'success';
  static readonly PRIMARY = 'primary';
  static readonly GRAY_LIGHT = 'gray-light';
}

@Component({
  selector: 'app-btn',
  templateUrl: './btn.component.html',
  styleUrls: []
})
export class BtnComponent implements OnInit {

  @Input() btnType: 'button' | 'reset' | 'submit' = 'button';
  @Input() color: 'success' | 'primary' | 'gray-light' = 'primary';

  _colors = {
    primary: {
      'text-white': true,
      'bg-primary-700': true,
      'hover:bg-primary-800': true,
      'focus:ring-primary-300': true
    },
    success: {
      'text-white': true,
      'bg-success-700': true,
      'hover:bg-success-800': true,
      'focus:ring-success-300': true,
    },
    "gray-light": {
      'bg-gray-200': true,
      'hover:bg-gray-500': true,
      'focus:ring-gray-50': true,
      'text-gray-700': true
    }
  }

  constructor() { }

  ngOnInit() {
  }

  get colors(){
    const _class = this._colors[this.color];
    if (_class){
      return _class;
    }

    return {};
  }

}
