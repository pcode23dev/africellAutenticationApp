import {
  Component, ElementRef, ViewChild, Output, EventEmitter,
  AfterViewInit, OnDestroy, ChangeDetectorRef, NgZone, Input,
  signal
} from '@angular/core';
import { IdAnalyzerService, IdAnalyzerResponse } from '../../services/id-analyzer.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-component-self',
  templateUrl: './component-self.html',
  styleUrl: './component-self.css',
  standalone: true
})
export class ComponentSelf implements AfterViewInit, OnDestroy {
  @Input() imagemDocumentoBase64!: string;
  @Output() aoVoltar = new EventEmitter<void>();
  @Output() aoFinalizar = new EventEmitter<{
    docImg: string;
    faceDocImg: string;
    selfieImg: string;
    result: any;
    face: any;
    matchrate: number;
  }>();

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  visualizacao: string | null = null;
  cameraAtiva = false;
  fluxo: MediaStream | null = null;
  modoCamera: 'user' | 'environment' = 'user';
  arquivoSelecionado: File | null = null;
  selfieBase64: string = '';
  loading = signal<boolean>(false);
  erro = signal<string>('');

  constructor(
    private route: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private idAnalyzer: IdAnalyzerService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => this.abrirCamera(), 100);
  }

  async abrirCamera(): Promise<void> {
    try {
      this.fluxo = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.modoCamera }
      });
      this.cameraAtiva = true;
      this.cdr.detectChanges();
      await new Promise(r => setTimeout(r, 100));
      const videoEl = this.video.nativeElement;
      videoEl.srcObject = this.fluxo;
      videoEl.onloadedmetadata = () => videoEl.play();
      this.erro.set("");
    } catch (err: any) {
      this.erro.set('Não foi possível acessar a câmera: ' + err.message);
    }
  }

  capturarFoto(): void {
    const videoEl = this.video.nativeElement;
    const canvasEl = this.canvas.nativeElement;
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    const ctx = canvasEl.getContext('2d');
    ctx?.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);

    canvasEl.toBlob(blob => {
      if (blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.ngZone.run(() => {
            this.visualizacao = reader.result as string;
            this.selfieBase64 = this.visualizacao.split(',')[1];
            this.arquivoSelecionado = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            this.fecharCamera();
            this.cdr.detectChanges();
          });
        };
        reader.readAsDataURL(blob);
      }
    }, 'image/jpeg');
  }

  continuar(): void {
    if (!this.arquivoSelecionado || !this.imagemDocumentoBase64) {
      this.erro.set('Documento ou selfie indisponível.');
      return;
    }
    this.loading.set(true);
    this.erro.set('Validando...');

    this.idAnalyzer.uploadAndMatch(this.imagemDocumentoBase64, this.selfieBase64)
      .subscribe({
        next: (res: IdAnalyzerResponse) => {
          this.erro.set("");
          this.loading.set(false);
          console.log("Retorno completo da API:", res);

          // Verifica se há erro lógico dentro da resposta (evita undefined)
          const erroApi = (res as any)?.error;

          const identical = res.face?.isIdentical || null;
          const confidence = parseFloat(res.face?.confidence || '0');

          // Verifica se a API retornou um erro lógico dentro do JSON

          if (identical && confidence >= 0.5) {
            // Avança com feedback positivo
            this.erro.set('✅ Selfie e documento correspondem.');

            setTimeout(() => {
              this.erro.set("");
              this.aoFinalizar.emit({
                docImg: res.cropped,
                faceDocImg: res.croppedface,
                selfieImg: this.selfieBase64,
                result: res.result,
                face: res.face,
                matchrate: res.matchrate
              });
            }, 1000);

          } else if (erroApi && erroApi.message) {
            this.erro.set(`❌ Erro da API: ${erroApi.message}`);
            setTimeout(() => {
              this.route.navigate(['/']);
            }, 5000);
          } else {
            // Feedback de falha
            this.loading.set(false);
            this.erro.set('❌ A selfie não corresponde ao documento. Tente novamente.');
          }
        },
        error: err => {
          this.loading.set(false);

          // Tenta extrair mensagem do corpo da resposta
          let msg = 'Erro desconhecido.';

          if (err.error?.error?.message) {
            msg = err.error.error.message; // ← mensagem real do IdAnalyzer
          } else if (err.error?.message) {
            msg = err.error.message;
          } else if (err.message) {
            msg = err.message;
          }

          this.erro.set('❌ Erro ao validar documento: ' + msg);
          console.error("Erro detalhado:", err);
        }
      });
  }

  tirarNovamente(): void {
    this.visualizacao = null;
    this.arquivoSelecionado = null;
    this.cdr.detectChanges();
    setTimeout(() => this.abrirCamera(), 100);
  }

  fecharCamera(): void {
    if (this.fluxo) this.fluxo.getTracks().forEach(t => t.stop());
    this.fluxo = null;
    this.cameraAtiva = false;
    this.cdr.detectChanges();
  }

  trocarCamera(): void {
    this.modoCamera = this.modoCamera === 'user' ? 'environment' : 'user';
    this.fecharCamera();
    setTimeout(() => this.abrirCamera(), 200);
  }

  voltar(): void {
    this.aoVoltar.emit();
  }

  ngOnDestroy(): void {
    this.fecharCamera();
  }
}
