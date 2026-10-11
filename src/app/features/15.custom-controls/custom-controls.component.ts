import { Component, signal } from '@angular/core';
import { Otp } from './components/otp/otp.component';
import { debounce, form, FormField, maxLength } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';

interface FormModel {
  otp: string;
}

@Component({
  imports: [Otp, FormField, JsonPipe ],
  selector: 'app-custom-controls',
  styleUrl: './custom-controls.component.css',
  templateUrl: './custom-controls.component.html',
})
export class CustomControls {

  protected formodel = signal<FormModel>({
    otp: ''
  });

  protected form1 = form(this.formodel, schema => {
    maxLength(schema.otp, 8);
  });

  reset() {
    this.form1.otp().reset();
  }

  focus() {
    this.form1.otp().focusBoundControl();
  }
}
