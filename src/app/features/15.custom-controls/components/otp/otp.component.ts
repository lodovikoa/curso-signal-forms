import { Component, computed, ElementRef, input, InputSignal, InputSignalWithTransform, model, output, OutputRef, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  imports: [ FormsModule ],
  selector: 'app-otp',
  styleUrl: './otp.component.css',
  templateUrl: './otp.component.html',
})
export class Otp implements FormValueControl<string> {
  value = model('');

  maxLength = input<number | undefined>();

  touch = output();

  resolveMaxLength = computed(() => this.maxLength() ?? 4);

  numberQuantityArray = computed(() => Array.from({ length: this.resolveMaxLength() }));

  inputElementRef = viewChild.required<ElementRef<HTMLInputElement>>('input');

  focus(options?: FocusOptions): void {
    this.inputElementRef().nativeElement.focus(options);
  }

  reset(): void {
    this.value.set('');
  }
}
