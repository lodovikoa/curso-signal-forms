import { schema, required, validate } from "@angular/forms/signals";

export const confirmPasswordSchema = schema<{password: string; confirmPassword: string}>(path => {
  required(path.password, { message: 'Senha é obrigatória' });
    required(path.confirmPassword, { message: 'Confirmar Senha é obrigatório' });

    validate(path.confirmPassword, ({ value, valueOf, state, stateOf }) => {
      const confirmPasswordValue = value();
      const passwordValue = valueOf(path.password);

      if (!state.touched() || !stateOf(path.password).touched()) {
        return null;
      }

      if (confirmPasswordValue !== passwordValue) {
        return {
          kind: 'passwordDoesNotMatch',
          message: 'As senhas não conferem'
        };
      }
      return null;
    })
});
