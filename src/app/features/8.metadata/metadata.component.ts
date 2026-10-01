import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, effect, Signal, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { createManagedMetadataKey, createMetadataKey, form, FormField, maxLength, metadata, MetadataReducer, minLength, required } from '@angular/forms/signals';
import { debounceTime } from 'rxjs';

const USERNAME_HELP = createMetadataKey<string>();
const HELP_LIST = createMetadataKey<string, string[]>(MetadataReducer.list());

const sumReducer: MetadataReducer<number, number> = {
  getInitial: () => 0,
  reduce: (acc, item) => acc + item,
}

const PASSWORD_SCORE = createMetadataKey<number, number>(sumReducer);

const USERNAME_GENERATOR = createManagedMetadataKey((state, value: Signal<string | undefined>) => {
  const response = signal<string | null>(null);
  const debouncedValue = toSignal(toObservable(value).pipe(debounceTime(500)));

  const resourceRef = httpResource<{ id: number; username: string }[]>( () => {
    const username = debouncedValue()?.trim();
    if (!username) {
      return undefined;
    }
    return `http://localhost:3000/usernames?username=${username}`;
  });

  effect(() => {
    if (!resourceRef.hasValue()) {
      return;
    }

    const isUsernameTaken = resourceRef.value().length > 0;
    if(isUsernameTaken) {
      const randomNumber = Math.floor(Math.random() * 900) + 100;
      const newUsername = `${value()}${randomNumber}`;

      untracked(() => {
        response.set(newUsername);
      });
    } else {
      untracked(() => {
        response.set(null);
      });
    }
  });

  return response;
});

interface FormModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-metadata',
  imports: [FormField],
  templateUrl: './metadata.component.html',
  styleUrl: './metadata.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Metadata {

  protected readonly USERNAME_HELP = USERNAME_HELP;
  protected readonly HELP_LIST = HELP_LIST;
  protected readonly PASSWORD_SCORE = PASSWORD_SCORE;
  protected readonly USERNAME_GENERATOR = USERNAME_GENERATOR;

  protected formModel = signal<FormModel>({
    username: '',
    password: '',
  });

  protected form1 = form(this.formModel, schema => {
    required(schema.username, { message: 'O username é obrigatório' });
    minLength(schema.username, 5, { message: 'O username deve ter no mínimo 5 caracteres' });
    maxLength(schema.username, 20, { message: 'O username deve ter no máximo 20 caracteres' });

    metadata(schema.username, USERNAME_GENERATOR, ({value}) => value());


    metadata(schema.username, USERNAME_HELP, fieldContext => {
      const value = fieldContext.value();
      const valueLength = value.length;
      const minLength = fieldContext.state.minLength!()!;
      const maxLength = fieldContext.state.maxLength!()!;
      const touched = fieldContext.state.touched();

      if (!touched) {
        if (valueLength === 0) {
          return `Digete um username com no mínimo ${minLength} e no máximo ${maxLength} caracteres`;
        }

        if (valueLength < 5) {
          return 'Boa! Continuie digitando...';
        }
      }

      if (valueLength >= 5 && valueLength <= 20) {
        return 'Muito bom! Esse username está ótimo.';
      }

      return '';

    });

    metadata(schema.password, HELP_LIST, () => 'Mensagem 1');
    metadata(schema.password, HELP_LIST, () => 'Mensagem 2');

    metadata(schema.password, PASSWORD_SCORE, (fieldContext) => {
      return fieldContext.value().length > 5 ? 25 : 0;
    })

    metadata(schema.password, PASSWORD_SCORE, (fieldContext) => {
      return /[A-Z]/.test(fieldContext.value()) ? 25 : 0;
    })

    metadata(schema.password, PASSWORD_SCORE, (fieldContext) => {
      return /[^a-zA-Z0-9]/.test(fieldContext.value()) ? 50 : 0;
    })
  });

  protected passwordScore = computed(() => {
    const score = this.form1.password().metadata(PASSWORD_SCORE)!();
    if (score <= 25) { return 'Fraco'; }
    if (score < 100) { return 'Normal'; }
    if (score >= 100) {return 'Forte'; }
    return null;
  })

  protected passwordScoreClass = computed(() => {
    const score = this.form1.password().metadata(PASSWORD_SCORE)!();
    if (score <= 25) { return 'text-error'; }
    if (score <= 50) { return 'text-warning'; }
    return 'text-success';
  })
}
