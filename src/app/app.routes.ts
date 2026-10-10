import { Routes } from '@angular/router';
import { SimplesForm } from './features/1.simple-form/simples-form.component';
import { NativeFields } from './features/2.native-fields/native-fields.component';
import { SubForms } from './features/3.sub-forms/sub-forms.component';
import { TranslateModel } from './features/4.translate-model/translate-model.component';
import { ArrayField } from './features/5.array-field/array-field.component';
import { Validators } from './features/6.validators/validators.component';
import { StateClasses } from './features/7.state-classes/state-classes.component';
import { Metadata } from './features/8.metadata/metadata.component';
import { CrossFieldValidation } from './features/9.cross-field-validation/cross-field-validation.component';
import { Zoid } from './features/10.zoid/zoid.component';
import { CompanyForm } from './features/11.company-form/company-form.component';
import { AsyncValidators } from './features/12.async-validators/async-validators.component';
import { SubmitForm } from './features/13.submit-form/submit-form.component';
import { FieldFocus } from './features/14.field-focus/field-focus.component';

export const routes: Routes = [
  { path: '1-simple-form', component:SimplesForm },
  { path: '2-native-fields', component:NativeFields },
  { path: '3-sub-forms', component:SubForms },
  { path: '4-translate-model', component:TranslateModel },
  { path: '5-array-fields', component:ArrayField },
  { path: '6-validators', component:Validators },
  { path: '7-state-classes', component:StateClasses },
  { path: '8-metadata', component:Metadata },
  { path: '9-cross-field-validation', component:CrossFieldValidation },
  { path: '10-zoid', component:Zoid },
  { path: '11-company-form', component:CompanyForm },
  { path: '12-async-validators', component:AsyncValidators },
  { path: '13-submit-form', component:SubmitForm },
  { path: '14-field-focus', component:FieldFocus }
];
