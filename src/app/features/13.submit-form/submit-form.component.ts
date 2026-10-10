import { Component, signal } from '@angular/core';
import { form, FormField, FormRoot, required, submit, validateHttp } from '@angular/forms/signals';

interface FormModel {
  username: string;
}

@Component({
  imports: [ FormField, FormRoot ],
  selector: 'app-submit-form',
  styleUrl: './submit-form.component.css',
  templateUrl: './submit-form.component.html',
})
export class SubmitForm {

  errorMessage = signal('');

  protected formModel = signal<FormModel>({
    username: '',
  });

  protected form1 = form(this.formModel, schema => {
    required(schema.username, { message: "Username é obrigatório!" })

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
    });
  }, {
    submission: {
      action: async (form) => {
        this.errorMessage.set('');
        console.log("Submit: ", form().value());

        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(true);
          }, 3000);
        });

        console.log('Finalizou o timer: ');

        // return {
        //   kind: 'serverError',
        //   fieldTree: form.username().fieldTree,
        //   message: 'Esse erro veio do servidor.'
        // };
      },
      onInvalid: (form) => {
        this.errorMessage.set('Formulário está com algum erro!')
      },
      ignoreValidators: 'none'
    }


  });

}
