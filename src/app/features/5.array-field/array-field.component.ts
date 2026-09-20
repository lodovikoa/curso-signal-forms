import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { applyEach, email, form, FormField, required } from '@angular/forms/signals';

interface FormModel {
  name: string;
  emails: string[];
}

@Component({
  selector: 'app-array-field',
  imports: [ FormField, JsonPipe ],
  templateUrl: './array-field.component.html',
  styleUrl: './array-field.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArrayField {

  protected formModel = signal<FormModel>({
    name: '',
    emails: ['']
  });

  protected form1 = form(this.formModel, schema => {
    applyEach(schema.emails, (schemaItem) => {
      required(schemaItem, { message: 'Email é obrigatório' });
      email(schemaItem, { message: 'Email inválido' });
    })
  });



  protected hasLessThanTwoEmails = computed(() => {
    return this.form1.emails().value().length < 2;
  })

  protected add() {
    this.form1.emails().value.update((value) => [...value, '']);
  }

  protected remove(index: number) {
    this.form1.emails().value.update((value) =>{
      return value.filter((email, i) => i !== index);
    });
  }
}
