import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

interface FormModel {
  name: string;
  email: string;
  value: number;
}

@Component({
  selector: 'app-simples-form',
  imports: [ FormField, JsonPipe ],
  templateUrl: './simples-form.component.html',
  styleUrl: './simples-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimplesForm {
  protected formModel = signal<FormModel>({
    name: '',
    email: '',
    value: 0
  })

  protected form = form(this.formModel)

  constructor() {
    this.form.email().value()
  }

  protected setValue() {
    this.formModel.set({
      name: 'John Doe',
      email: 'john.doe@example.com',
      value: 100
    });
  }

  protected resetValue() {
    this.form().reset({
      email: '',
      name: '',
      value: 0
    });
  }

}
