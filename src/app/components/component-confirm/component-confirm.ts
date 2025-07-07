import { Component, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-component-confirm',
  templateUrl: './component-confirm.html',
  styleUrls: ['./component-confirm.css'],
  imports: [ReactiveFormsModule]
})
export class ComponentConfirm {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Input() telefone = '';  // agora setado pelo pai
  @Input() dados!: any;

  @Output() aoConfirmar = new EventEmitter<string>();
  @Output() aoVoltar = new EventEmitter<void>();

  codigoForm: FormGroup;
  mensagem = '';
  mensagemErro = '';
  carregandoEnviar = false;
  carregandoConfirmar = false;

  loading = signal<boolean>(false);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.codigoForm = this.fb.group({
      d0: ['', [Validators.required, Validators.pattern('\\d')]],
      d1: ['', [Validators.required, Validators.pattern('\\d')]],
      d2: ['', [Validators.required, Validators.pattern('\\d')]],
      d3: ['', [Validators.required, Validators.pattern('\\d')]],
      d4: ['', [Validators.required, Validators.pattern('\\d')]],
      d5: ['', [Validators.required, Validators.pattern('\\d')]],
    });
  }

  /*
  ngOnInit() {
    this.enviarCodigo();
  }*/

  enviarCodigo() {
    this.carregandoEnviar = true;
    this.mensagem = 'Enviando código...';
    this.http.post<{ status: string }>(
      'http://localhost:3000/send-otp',
      { phone: this.telefone }
    ).subscribe({
      next: res => {
        this.carregandoEnviar = false;
        if (res.status === 'pending') {
          this.mensagem = '📨 Código enviado!';
          setTimeout(() =>
            this.codeInputs.first?.nativeElement.focus(), 0
          );
        } else {
          this.mensagemErro = '❌ Erro ao enviar código. Tente novamente.';
        }
      },
      error: err => {
        this.carregandoEnviar = false;
        this.mensagemErro = '❌ Erro ao enviar código: ' + err.message;
      }
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
    setTimeout(() => this.codeInputs.first?.nativeElement.focus(), 0);
  }

  confirmar() {
    if (this.codigoForm.invalid) {
      this.mensagemErro = 'Por favor, insira os 6 dígitos.';
      return;
    }

    this.loading.set(true);

    const code = Object.values(this.codigoForm.value).join('');
    this.carregandoConfirmar = true;
    this.mensagem = 'Verificando código...';
    this.mensagemErro = '';

    this.aoConfirmar.emit(code);
    
  }

  voltar() {
    this.aoVoltar.emit();
  }
}


/*

*/