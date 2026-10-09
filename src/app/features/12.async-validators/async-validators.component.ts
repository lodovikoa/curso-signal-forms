import { Component, resource, signal } from '@angular/core';
import { form, FormField, validateAsync, email, validateHttp } from '@angular/forms/signals';

interface FormModel {
  email: string;
  username: string;
}

@Component({
  imports: [FormField],
  selector: 'app-async-validators',
  styleUrl: './async-validators.component.css',
  templateUrl: './async-validators.component.html',
})
export class AsyncValidators {

  protected formModel = signal<FormModel>({
    email: '',
    username: '',
  });

  protected form1 = form(this.formModel, schema => {
    validateAsync(schema.email, {
      params: ({ value }) => {
        const email = value();
        if (!email) { return undefined; }
        return { email };
      },
      factory: (params) => {
        return resource({
          params: () => ({ email: params()?.email }),
          loader: ({ params: { email } }) => {
            if (!email) {
              return Promise.resolve(undefined);
            } else if (email) {
              return this.isEmailTaken(email);
            }
            // return this.isEmailTaken(email);
            throw new Error('Algo deu errado');
           },
        });
      },
      onSuccess: (result, {fieldTree}) => {
        if (!result) { return null; }

        return {
          kind: 'emailTaken',
          message: 'Email já cadastrado',
          fieldTree,
        };

      },
      onError: (error) => {
        return {
          kind: 'randomError',
          message: (error as Error).message,
        };
      }
    });

    validateHttp(schema.username, {
      request: ({ value }) => {
        const username = value();
        return `http://localhost:3000/usernames?username:eq=${username}`;

      },
      onError: (error) => {

      },
      onSuccess: (result: { id:number, username:string }[], {fieldTree}) => {
        if(result.length > 0) {
          return {
            kind: 'usernameTaken',
            message: 'Username já cadastrado',
            fieldTree,
          };
        }
        return null;
      },
      debounce: 500,
      when: ({ value }) => !!value(),
    })

  });

  private takenEmails = signal<string[]>(['teste@gmail.com', 'joao@teste.com']);

  private isEmailTaken(email: string) {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const isTaken = this.takenEmails().includes(email);
        resolve(isTaken);
      }, 1000);
    });
  }
}
