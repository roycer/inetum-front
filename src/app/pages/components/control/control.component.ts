import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Control } from 'src/app/models/control.model';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  @Input() control!: Control;
  @Input() form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
