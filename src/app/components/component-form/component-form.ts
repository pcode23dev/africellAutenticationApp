import { Component, EventEmitter, Output } from '@angular/core';
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

  @Output() aoContinuar = new EventEmitter<any>(); // Use 'any' para enviar todos os dados

  formulario: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      apelido: [''],
      biNumber: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['']
    });
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.aoContinuar.emit(this.formulario.value);
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  irParaHome() {
    this.router.navigate(['/']);
  }
}