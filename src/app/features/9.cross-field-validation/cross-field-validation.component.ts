import { Component, signal } from '@angular/core';
import { form, FormField, validateTree, apply } from '@angular/forms/signals';
import { confirmPasswordSchema } from './schemas';

interface FormModel {
  password: string;
  confirmPassword: string;
  names: {
    name1: string;
    name2: string;
    name3: string;
    name4: string;
  }
}

@Component({
  imports: [FormField],
  selector: 'app-cross-field-validation',
  styleUrl: './cross-field-validation.component.css',
  templateUrl: './cross-field-validation.component.html',
})
export class CrossFieldValidation {

  protected formModel = signal<FormModel>({
    password: '',
    confirmPassword: '',
    names: {
      name1: '',
      name2: '',
      name3: '',
      name4: ''
    }
  })

  protected form1 = form(this.formModel, schema => {
    apply(schema, confirmPasswordSchema);

    validateTree(schema.names, ({ value, fieldTreeOf }) => {
      const fields = Object.keys(value()).map((propName) => {
        return {
          value: (value() as any)[propName],
          fieldTree: fieldTreeOf((schema.names as any)[propName])
        }
      })

      const duplucatedFields: typeof fields = [];
      const uniqueFields = new Set<string>();

      fields
        .filter((field) => !!field.value)
        .forEach((field) => {
          if (uniqueFields.has(field.value)) {
            duplucatedFields.push(field);
          } else {
            uniqueFields.add(field.value);
          }
        });

      if (duplucatedFields.length > 0) {
        return duplucatedFields.map((field) => {
          return {
            kind: 'duplicatedField',
            fieldTree: field.fieldTree,
            message: 'Este campo está duplicado'
          }
        });
      }
      return null;
    });
  });
}
