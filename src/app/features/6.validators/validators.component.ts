import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { email, form, FormField, max, maxLength, min, minLength, pattern, required, validate } from '@angular/forms/signals';

interface Employee {
  username: string;
  age: number;
  email: string;
}

@Component({
  selector: 'app-validators',
  imports: [ FormField ],
  templateUrl: './validators.component.html',
  styleUrl: './validators.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Validators {

  // Modelo de dados do formulário - Boas práticas: Usar interfaces para definir o modelo de dados do formulário, garantindo tipagem e consistência.
  employeeModel = signal<Employee>({
    username: '',
    age: 0,
    email: ''
  });

  // Declaração do form e validações
  form1 = form(this.employeeModel, schema => {
    required(schema.username, { message:'Username é obrigatório' });
    minLength(schema.username, 5, { message:'Username deve ter no mínimo 5 caracteres' });
    maxLength(schema.username, 15, { message:'Username deve ter no máximo 15 caracteres' });
    pattern(schema.username, /^[a-z0-9@]+$/, { message:'Username deve conter apenas letras minúsculas e números' });
    validate(schema.username, ({ value }) => {
      if(!value().startsWith('@')) {
        return { kind: 'missingAt', message: 'Username deve começar com @' };
      }
      return null;
    });

    required(schema.age, { message:'Age é obrigatório' });
    min(schema.age, 18, { message:'Idade deve ser maior ou igual a 18 anos' });
    max(schema.age, 65, { message:'Idade deve ser menor ou igual a 65 anos' });

    required(schema.email, { message:'Email é obrigatório' });
    email(schema.email, { message:'Email inválido' });

  });
}
