import {
  Component, ElementRef, ViewChild, Output, EventEmitter,
  AfterViewInit, OnDestroy, ChangeDetectorRef, NgZone, Input
} from '@angular/core';
import { IdAnalyzerService, IdAnalyzerResponse } from '../../services/id-analyzer.service';

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
    matchrate: number;
  }>();

  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  visualizacao: string | null = null;
  erro: string | null = null;
  cameraAtiva = false;
  fluxo: MediaStream | null = null;
  modoCamera: 'user' | 'environment' = 'user';
  arquivoSelecionado: File | null = null;
  selfieBase64: string = '';

  constructor(
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
      this.erro = null;
    } catch (err: any) {
      this.erro = 'Não foi possível acessar a câmera: ' + err.message;
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
      this.erro = 'Documento ou selfie indisponível.';
      return;
    }
    this.erro = 'Validando...';
    this.idAnalyzer.uploadAndMatch(
      this.imagemDocumentoBase64,
      this.selfieBase64
    ).subscribe({
      next: (res: IdAnalyzerResponse) => {
        this.erro = null;
        console.log("Retorno completo da API:", res);
        this.aoFinalizar.emit({
          docImg: res.cropped,
          faceDocImg: res.croppedface,
          selfieImg: this.selfieBase64,
          result: res.result,
          matchrate: res.matchrate
        });
      },
      error: err => {
        this.erro = 'Erro na verificação: ' + err.message;
        console.error(err);
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
