import {
  Component,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

@Component({
  selector: 'app-component-self',
  templateUrl: './component-self.html',
  styleUrl: './component-self.css',
  standalone: true
})
export class ComponentSelf implements AfterViewInit, OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Output() aoContinuar = new EventEmitter<File>();
  @Output() aoVoltar = new EventEmitter<void>();
  @Output() aoCapturar = new EventEmitter<File>();

  visualizacao: string | null = null;
  erro: string | null = null;
  cameraAtiva = false;
  fluxo: MediaStream | null = null;
  modoCamera: 'user' | 'environment' = 'user';
  arquivoSelecionado: File | null = null;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Garante que a câmera será iniciada automaticamente ao carregar a view
    setTimeout(() => this.abrirCamera(), 100);
  }

  async abrirCamera(): Promise<void> {
    try {
      this.fluxo = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.modoCamera }
      });

      this.cameraAtiva = true;
      this.cdr.detectChanges(); // Força o Angular a redesenhar o DOM

      setTimeout(() => {
        const videoEl = this.video.nativeElement;
        videoEl.srcObject = this.fluxo;
        videoEl.onloadedmetadata = () => {
          videoEl.play();
        };
      }, 100);

      this.erro = null;
    } catch (err) {
      this.erro = 'Não foi possível acessar a câmera. Verifique as permissões.';
      console.error(err);
    }
  }

  capturarFoto(): void {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        this.ngZone.run(() => {
          const foto = new File([blob], 'foto_selfie.jpg', { type: 'image/jpeg' });
          this.arquivoSelecionado = foto;
          this.visualizacao = URL.createObjectURL(foto);
          this.erro = null;

          this.aoCapturar.emit(foto);
          this.cdr.detectChanges(); // Atualiza a view com o preview

          this.fecharCamera(); // ← Só fecha após garantir captura
        });
      }
    }, 'image/jpeg');
  }

  fecharCamera(): void {
    if (this.fluxo) {
      this.fluxo.getTracks().forEach(track => track.stop());
      this.fluxo = null;
    }
    this.cameraAtiva = false;
    this.cdr.detectChanges();
  }

  trocarCamera(): void {
    this.modoCamera = this.modoCamera === 'user' ? 'environment' : 'user';
    this.fecharCamera();
    setTimeout(() => this.abrirCamera(), 200);
  }

  tirarNovamente(): void {
    this.visualizacao = null;
    this.arquivoSelecionado = null;
    this.cdr.detectChanges();
    setTimeout(() => this.abrirCamera(), 100);
  }

  continuar(): void {
    if (this.arquivoSelecionado) {
      this.aoContinuar.emit(this.arquivoSelecionado);
    } else {
      this.erro = 'Nenhuma imagem foi capturada.';
    }
  }

  voltar(): void {
    this.aoVoltar.emit();
  }

  ngOnDestroy(): void {
    this.fecharCamera();
  }
}