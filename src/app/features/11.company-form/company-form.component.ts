import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, required, FormField, applyWhen, applyWhenValue, hidden, readonly, disabled } from '@angular/forms/signals';

interface CompanyRegistration {
  company: {
    cnpj: string;
    legalName: string;
  }
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
  imports: [FormField, FormsModule],
  selector: 'app-company-form',
  styleUrl: './company-form.component.css',
  templateUrl: './company-form.component.html',
})
export class CompanyForm {

  protected isApproved = signal(false);

  protected formModel = signal<CompanyRegistration>({
    company: {
      cnpj: '',
      legalName: ''
    },
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

    readonly(schema.company.cnpj, {
      when: () => this.isApproved(),
    })

    readonly(schema.company.legalName, {
      when: () => this.isApproved(),
    })

    disabled(schema.payment, {
      when: ({ valueOf }) => !valueOf(schema.company.cnpj)? 'Preencha o CNPJ da empresa': false,
    })
  });
}
