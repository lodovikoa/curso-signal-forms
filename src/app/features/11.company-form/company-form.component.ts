import { Component, signal } from '@angular/core';
import { form, required, FormField, applyWhen, applyWhenValue, hidden } from '@angular/forms/signals';

interface CompanyRegistration {
  isTaxPayer: boolean;
  stateRegistration: string;
  sellsProduct: boolean;
  taxRegime: string;
  addressState: string;
  payment: {
    method: 'pix' | 'bank';
    pix: {
      key: string;
    },
    bank: {
      code: string;
      agency: string;
      account: string;
    }
  }
};

@Component({
  imports: [FormField],
  selector: 'app-company-form',
  styleUrl: './company-form.component.css',
  templateUrl: './company-form.component.html',
})
export class CompanyForm {

  protected formModel = signal<CompanyRegistration>({
    isTaxPayer: false,
    stateRegistration: '',
    sellsProduct: false,
    taxRegime: '',
    addressState: '',
    payment: {
      method: 'pix',
      pix: {
        key: ''
      },
      bank: {
        code: '',
        agency: '',
        account: ''
      }
    }
  });

  protected form1 = form(this.formModel, (schema) => {
    required(schema.stateRegistration, {
      when: ({ valueOf }) => valueOf(schema.isTaxPayer),
      message: 'Inscrição estadual é obrigatória para contribuintes do ICMS'
    });

    applyWhenValue(schema, ({ sellsProduct }) => sellsProduct === true, (schema) => {
      required(schema.stateRegistration, { message: 'Inscrição estadual é obrigatória para empresas que vendem produtos' })
      required(schema.taxRegime, { message: 'Regime tributário é obrigatório para empresas que vendem produtos' })
      required(schema.addressState, { message: 'Estado é obrigatório para empresas que vendem produtos' })
      });

    hidden(schema.payment.bank, {
      when: ({ valueOf }) => valueOf(schema.payment.method) !== 'bank',
    })

    hidden(schema.payment.pix, {
      when: ({ valueOf }) => valueOf(schema.payment.method) !== 'pix',
    })
  });
}
