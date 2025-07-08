import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren, AfterViewInit, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-component-confirm',
  standalone: true,
  imports: [
    ReactiveFormsModule,    // para FormBuilder, FormGroup, Validators
    RouterModule            // para Router
  ],
  templateUrl: './component-confirm.html',
  styleUrls: ['./component-confirm.css'],
})

export class ComponentConfirm implements OnInit, AfterViewInit {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @Input() telefone = '';  // agora setado pelo pai
  @Input() dados!: any;

  @Output() aoConfirmar = new EventEmitter<string>();
  @Output() aoVoltar = new EventEmitter<void>();

  codigoForm: FormGroup;

  carregandoEnviar = false;
  carregandoConfirmar = false;


  @Input() tel = signal<string>('');
  mensagem = signal<string>('');
  mensagemErro = signal<string>('');
  loading = signal<boolean>(true);


  setTelefone(): void {
    this.tel.set("+244" + this.telefone);
  }


  constructor(private route: Router, private fb: FormBuilder, private http: HttpClient) {
    this.codigoForm = this.fb.group({
      d0: ['', [Validators.required, Validators.pattern('\\d')]],
      d1: ['', [Validators.required, Validators.pattern('\\d')]],
      d2: ['', [Validators.required, Validators.pattern('\\d')]],
      d3: ['', [Validators.required, Validators.pattern('\\d')]],
      d4: ['', [Validators.required, Validators.pattern('\\d')]],
      d5: ['', [Validators.required, Validators.pattern('\\d')]],
    });
  }


  ngOnInit() {
    this.setTelefone();
    this.enviarCodigo();
  }

  enviarCodigo() {
    this.carregandoEnviar = true;
    this.mensagem.set('📨 Enviando código...');
    this.mensagemErro.set('');

    this.http.post<{ status: string; error?: string }>(
      'http://localhost:3000/send-otp',
      { phone: this.tel() }
    ).subscribe({
      next: res => {
        this.carregandoEnviar = false;
        if (res.status === 'pending') {
          this.mensagem.set('✅ Código enviado! Verifique o SMS.');
          setTimeout(() =>
            this.codeInputs.first?.nativeElement.focus(), 0
          );
          setTimeout(() => {
            this.loading.set(false);
          }, 2000);
        } else {
          this.mensagemErro.set('❌ Erro ao enviar código. Tente novamente.');
          this.scheduleNavigateHome();
        }
      },
      error: err => {
        this.carregandoEnviar = false;

        const msg = err.error?.error || err.error?.message || err.message;
        let display = `❌ Erro ao enviar código: ${msg}`;

        if (err.status === 400 && msg.includes('não verificado')) {
          display = '❌ Número não verificado no trial. Atualize ou verifique no Twilio.';
        } else if (err.status === 400 && msg.includes('inválido')) {
          display = '❌ Número inválido. Formato correto: +244XXXXXXXXX.';
        }

        this.mensagemErro.set(display);
        this.scheduleNavigateHome();
        console.error('Erro em send-otp:', err);
      }
    });
  }

  scheduleNavigateHome() {
    setTimeout(() => {
      this.route.navigate(['/']);
    }, 5000);  // exibir mensagem por 3 segundos
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
      this.mensagemErro.set('⚠️ Por favor, insira os 6 dígitos.');
      return;
    }

    this.loading.set(true);
    this.carregandoConfirmar = true;
    this.mensagem.set('Verificando código...');
    this.mensagemErro.set('');

    const code = Object.values(this.codigoForm.value).join('');

    this.http.post<{ status: string; error?: string }>(
      'http://localhost:3000/check-otp',
      { phone: this.tel(), code }
    ).subscribe({
      next: res => {
        this.loading.set(false);
        this.carregandoConfirmar = false;

        if (res.status === 'approved') {
          this.mensagem.set('🎉 Verificado com sucesso!');
          this.aoConfirmar.emit(code);

        } else if (res.status === 'pending') {
          this.mensagemErro.set('❌ Código inválido. Tente novamente.');

        } else {
          this.mensagemErro.set(`❌ Erro: ${res.error || res.status}`);
        }
      },
      error: err => {
        this.loading.set(false);
        this.carregandoConfirmar = false;

        const msg = err.error?.error || err.error?.message || err.message;

        switch (err.status) {
          case 400:
            this.mensagemErro.set('❌ ' + msg);
            break;
          case 404:
            this.mensagemErro.set('❌ Código expirou ou não encontrado.');
            break;
          case 429:
            this.mensagemErro.set('⚠️ Muitas tentativas. Tente novamente em alguns minutos.');
            break;
          default:
            this.mensagemErro.set('❌ Erro ao verificar código. ' + msg);
        }

        console.error('Erro em check-otp:', err);
      }
    });
  }

  voltar() {
    this.aoVoltar.emit();
  }

}


/*

*/