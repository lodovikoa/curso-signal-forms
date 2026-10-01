import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, required } from '@angular/forms/signals';

interface FormModel {
  name: string;
}

@Component({
  selector: 'app-state-classes',
  imports: [ FormField ],
  templateUrl: './state-classes.component.html',
  styleUrl: './state-classes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StateClasses {

  protected forModel = signal<FormModel>({
    name: ''
  });

  protected form1 = form(this.forModel, schema => {
    required(schema.name, { message: 'O nome é obrigatório' });
  })
}
