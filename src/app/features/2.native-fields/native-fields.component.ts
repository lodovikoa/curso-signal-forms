import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';


enum Themes {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

enum Frequencies {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

const ThemeLabelMapper: Record<Themes, string> = {
  [Themes.Light]: 'Claro',
  [Themes.Dark]: 'Escuro',
  [Themes.System]: 'Sistema'
};

const FrequencyLabelMapper: Record<Frequencies, string> = {
  [Frequencies.Daily]: 'Diário',
  [Frequencies.Weekly]: 'Semanal',
  [Frequencies.Monthly]: 'Mensal'
};

function createThemeOptions() {
  return Object.values(Themes).map((theme) => ({
    label: ThemeLabelMapper[theme],
    value: theme,
  }));
}

function createFrequencyOptions() {
  return Object.values(Frequencies).map((frequency) => ({
    label: FrequencyLabelMapper[frequency],
    value: frequency,
  }));
}

interface FormModel {
  date: Date | string;
  time: Date,
  datetime: number | string;
  theme: Themes;
  receiveNews: boolean;
  frequency: Frequencies;
}

@Component({
  selector: 'app-native-fields',
  imports: [FormField],
  templateUrl: './native-fields.component.html',
  styleUrl: './native-fields.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NativeFields {

  protected themeOptions = signal(createThemeOptions());
  protected frequencyOptions = signal(createFrequencyOptions());

  protected formModel = signal<FormModel>({
    date: new Date().toISOString().split('T')[0],
    time: '04:50' as unknown as Date,
    datetime: Date.now(),
    theme: '' as Themes,
    receiveNews: false,
    frequency: '' as Frequencies,
  })

  protected form = form(this.formModel);
  datetimeToISO = computed(() => new Date(this.formModel().datetime).toISOString());

}
