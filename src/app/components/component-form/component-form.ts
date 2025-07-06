import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-form',
  templateUrl: './component-form.html',
  styleUrl: './component-form.css',
  standalone: true,
  imports: [ReactiveFormsModule]
})

export class ComponentForm {
  @Output() aoContinuar = new EventEmitter<any>();
  formulario: FormGroup;
  validado = signal<boolean>(true);

  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario = this.fb.group({
      nome: ['', [Validators.required, Validators.pattern(/\S+/)]],
      apelido: [''],
      biNumber: ['', [Validators.required, Validators.pattern(/^\d{9}[a-zA-Z]{2}\d{3}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[9][1-579]\d{7}$/)]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
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