import { Component, signal } from '@angular/core';
import { form, FormField, validateStandardSchema } from '@angular/forms/signals';
import { z } from 'zod'

const ProductSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  price: z.number().positive('Preço tem que ser maior que 0').nullable(),
});

type Product = z.infer<typeof ProductSchema>;

@Component({
  imports: [ FormField ],
  selector: 'app-zoid',
  styleUrl: './zoid.component.css',
  templateUrl: './zoid.component.html',
})
export class Zoid {

  protected formModel = signal<Product>({
    name: '',
    price: 0
  });

  protected form1 = form(this.formModel, schemaPath => {
    validateStandardSchema(schemaPath, ProductSchema);
  })
}

