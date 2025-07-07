import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-component-confirm',
  templateUrl: './component-confirm.html',
  styleUrls: ['./component-confirm.css'],
  imports: [ReactiveFormsModule]
})
export class ComponentConfirm {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Output() aoConfirmar = new EventEmitter<string>();
  @Input() dados!: any;

  @Output() aoVoltar = new EventEmitter<void>();

  voltar() {
    this.aoVoltar.emit();
  }


  codigoForm: FormGroup;
  mensagem: string = '';
  mensagemErro: string = '';
  telefoneParcial = '...315';

  constructor(private fb: FormBuilder) {
    this.codigoForm = this.fb.group({
      d0: ['', [Validators.required, Validators.pattern('\\d')]],
      d1: ['', [Validators.required, Validators.pattern('\\d')]],
      d2: ['', [Validators.required, Validators.pattern('\\d')]],
      d3: ['', [Validators.required, Validators.pattern('\\d')]],
      d4: ['', [Validators.required, Validators.pattern('\\d')]],
      d5: ['', [Validators.required, Validators.pattern('\\d')]],
    });
  }

  onInput(event: any, idx: number) {
    const input = event.target as HTMLInputElement;
    if (!/^\d$/.test(input.value)) {
      input.value = '';
      this.codigoForm.get(`d${idx}`)?.setValue('');
      return;
    }
    if (input.value && idx < 5) {
      this.codeInputs.get(idx + 1)?.nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, idx: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && idx > 0) {
      this.codeInputs.get(idx - 1)?.nativeElement.focus();
    }
  }

  ngAfterViewInit() {
    // Foca no primeiro input ao abrir
    setTimeout(() => this.codeInputs.first?.nativeElement.focus(), 0);
  }

  confirmar() {
    if (this.codigoForm.valid) {
      const code = Object.values(this.codigoForm.value).join('');
      this.mensagem = 'Código confirmado com sucesso!';
      this.mensagemErro = '';
      this.aoConfirmar.emit(code);
    } else {
      this.mensagemErro = 'Por favor, insira todos os 6 dígitos.';
      this.mensagem = '';
    }
  }
}