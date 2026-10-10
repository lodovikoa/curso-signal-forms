import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required } from '@angular/forms/signals';

interface User {
  name: string;
  username: string;
  email: string;
}

@Component({
  imports: [ FormField, FormRoot ],
  selector: 'app-field-focus',
  styleUrl: './field-focus.component.css',
  templateUrl: './field-focus.component.html',
})
export class FieldFocus {

  protected formModel = signal<User>({
    name: '',
    username: '',
    email: '',
  })

  protected form1 = form(this.formModel, (schema) => {
    required(schema.name, {message: 'Nome é obrigatório'});
    required(schema.username, {message: 'Username é obrigatório'});
    required(schema.email, {message: 'Email é obrigatório'});
  }, {
    submission: {
      action: async() => {
        console.log('Formulario: ', this.formModel())
      },
      onInvalid: (formInvalid) => {
        formInvalid().errorSummary()[0]?.fieldTree().focusBoundControl();
      }
    }
  });

  applyFocus() {
  }
}
