import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-component-form-registrado',
  imports: [ReactiveFormsModule],
  templateUrl: './component-form-registrado.html',
  styleUrl: './component-form-registrado.css',
  standalone: true
  
})
export class ComponentFormRegistrado {
  @Output() aoContinuar = new EventEmitter<any>();
  formulario: FormGroup;
  validado = signal<boolean>(true);

  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^[9][1-579]\d{7}$/)]]
    });
  }

  campoInvalido(nomeCampo: string): boolean {
    const ctrl = this.formulario.get(nomeCampo);
    return !!ctrl && ctrl.touched && ctrl.invalid;
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.validado.set(true);
      this.aoContinuar.emit(this.formulario.value);
    } else {
      this.validado.set(false);
      this.formulario.markAllAsTouched();
    }
  }

  irParaHome() {
    this.router.navigate(['/']);
  }
}