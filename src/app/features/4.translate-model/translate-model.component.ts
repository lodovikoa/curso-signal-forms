import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, linkedSignal, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { form, FormField } from '@angular/forms/signals';

interface FormModel {
  personal: {
    name: string;
    email: string;
  },
  address: {
    zipcode: string;
    street: string;
    number: string;
  }
}

interface domainModel {
  personal: {
    name: string;
    email: string;
  },
  address: null | {
    zipcode: string | null;
    street: string | null;
    number: string | null;
  }
}

function domaniModelToFormModel(domainModel: domainModel): FormModel {
  return {
     personal: {
      name: domainModel.personal.name,
      email: domainModel.personal.email
    },
    address: {
      zipcode: domainModel.address?.zipcode ?? '',
      street: domainModel.address?.street ?? '',
      number: domainModel.address?.number ?? ''
    }
  }
}

function formModelToDomainModel(formModel: FormModel): domainModel {
  const isAddressEmpty = Object.values(formModel.address).every((value) => value === '');

  return {
    personal: {
      name: formModel.personal.name,
      email: formModel.personal.email
    },
    address: isAddressEmpty ? null : {
      zipcode: formModel.address.zipcode,
      street: formModel.address.street,
      number: formModel.address.number
    }
  }
}

@Component({
  selector: 'app-translate-model',
  imports: [ FormField, JsonPipe ],
  templateUrl: './translate-model.component.html',
  styleUrl: './translate-model.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TranslateModel {

  private httpClient = inject(HttpClient);

  private emptyFormModel = signal<FormModel>({
    personal: {
      name: '',
      email: ''
    },
    address: {
      zipcode: '',
      street: '',
      number: ''
    }
  });

  protected profileDataRef = rxResource({
    stream: () => this.getProfile(),
  })

  protected formModel = linkedSignal<FormModel>(() => {
    if(!this.profileDataRef.hasValue()){
      return this.emptyFormModel();
    }

    return domaniModelToFormModel(this.profileDataRef.value() )
  });

  protected form1 = form(this.formModel)

  protected save() {
    const payload = formModelToDomainModel(this.formModel());

    this.saveProfile(payload).subscribe((profile) => {
      console.log('Profile saved', profile)
    })
  }

  private saveProfile(payload: domainModel) {
    return this.httpClient.put<domainModel>('http://localhost:3000/profile', payload);
  }

  private getProfile() {
    return this.httpClient.get<domainModel>('http://localhost:3000/profile');
  }

}
