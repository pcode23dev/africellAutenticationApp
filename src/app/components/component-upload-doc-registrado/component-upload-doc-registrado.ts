import {
  Component, ElementRef, ViewChild, Output, EventEmitter,
  OnDestroy, ChangeDetectorRef, NgZone,
  signal
} from '@angular/core';
import { inject } from '@angular/core';
import { IdAnalyzerService } from '../../services/id-analyzer.service'; // Caminho corrigido!

@Component({
  selector: 'app-component-upload-doc-registrado',
  imports: [],
  templateUrl: './component-upload-doc-registrado.html',
  styleUrl: './component-upload-doc-registrado.css'
})



export class ComponentUploadDocRegistrado implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  @Output() carregando = signal<boolean>(true);


  @Output() aoContinuar = new EventEmitter<string>(); // Corrigido para string (número do BI)
  @Output() aoVoltar = new EventEmitter<void>();

  private idAnalyzerService = inject(IdAnalyzerService); // Corrigido: usa o serviço certo

  visualizacao: string | null = null;
  erro: string | null = null;
  cameraAtiva = false;
  fluxo: MediaStream | null = null;
  modoCamera: 'environment' | 'user' = 'environment';
  arquivoSelecionado: File | null = null;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  abrirArquivo(): void {
    this.fileInput.nativeElement.click();
  }

  aoSelecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const arquivo = input.files[0];
      if (!arquivo.type.startsWith('image/')) {
        this.erro = 'Por favor, selecione uma imagem.';
        return;
      }
      if (arquivo.size > 5 * 1024 * 1024) {
        this.erro = 'Arquivo muito grande (máx 5MB).';
        return;
      }
      this.arquivoSelecionado = arquivo;
      const leitor = new FileReader();
      leitor.onload = () => {
        this.ngZone.run(() => {
          this.visualizacao = leitor.result as string;
          this.erro = null;
          this.cdr.detectChanges();
        });
      };
      leitor.readAsDataURL(arquivo);
    }
  }

  async abrirCamera(): Promise<void> {
    try {
      this.fluxo = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.modoCamera }
      });
      this.cameraAtiva = true;
      this.cdr.detectChanges();
      await new Promise(r => setTimeout(r, 100));
      if (this.video?.nativeElement) {
        this.video.nativeElement.srcObject = this.fluxo;
        this.video.nativeElement.onloadedmetadata = () => {
          this.video.nativeElement.play();
        };
      }
      this.erro = null;
    } catch (err: any) {
      this.erro = 'Erro ao acessar a câmera: ' + err.message;
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
        this.ngZone.run(() => {
          this.arquivoSelecionado = new File([blob], 'frente_documento.jpg', { type: 'image/jpeg' });
          this.visualizacao = URL.createObjectURL(blob);
          this.erro = null;
          this.fecharCamera();
          this.cdr.detectChanges();
        });
      }
    }, 'image/jpeg');
  }

  fecharCamera(): void {
    if (this.fluxo) this.fluxo.getTracks().forEach(t => t.stop());
    this.fluxo = null;
    this.cameraAtiva = false;
    this.cdr.detectChanges();
  }

  trocarCamera(): void {
    this.modoCamera = this.modoCamera === 'environment' ? 'user' : 'environment';
    this.fecharCamera();
    setTimeout(() => this.abrirCamera(), 100);
  }

  removerPreview(): void {
    this.visualizacao = null;
    this.erro = null;
    this.fileInput.nativeElement.value = '';
    this.cdr.detectChanges();
  }

  continuar(): void {
    if (!this.arquivoSelecionado) {
      this.erro = 'Nenhuma imagem selecionada.';
      return;
    }

    this.erro = null;
    this.visualizacao = null;

    this.toBase64(this.arquivoSelecionado).then(base64 => {
      this.erro = 'Analisando documento...';

      this.idAnalyzerService.uploadDocumento(base64).subscribe({
        next: res => {
          console.log('Resposta completa:', res);
          const biNumber = res?.result?.documentNumber || res?.result?.number;

          if (biNumber) {
            this.erro = null;            
            this.aoContinuar.emit(biNumber); // Emitir número do BI
          } else {
            this.erro = 'Número do BI não encontrado no documento.';
          }
        },
        error: err => {
          console.error('Erro ao analisar documento:', err);
          this.erro = 'Erro ao analisar: ' + (err?.message || 'erro desconhecido');
        }
      });
    }).catch(() => {
      this.erro = 'Erro ao converter imagem para base64.';
    });
  }

  private toBase64(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
  }

  voltar(): void {
    this.aoVoltar.emit();
  }

  ngOnDestroy(): void {
    this.fecharCamera();
  }
}
