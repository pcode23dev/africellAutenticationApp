import { Component, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-component-self',
  imports: [],
  templateUrl: './component-self.html',
  styleUrl: './component-self.css'
})
export class ComponentSelf implements OnDestroy {
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


  async abrirCamera() {
    try {
      this.fluxo = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.modoCamera }
      });
      this.cameraAtiva = true;
      setTimeout(() => {
        if (this.video && this.video.nativeElement) {
          this.video.nativeElement.srcObject = this.fluxo;
        }
      });
      this.erro = null;
    } catch (err) {
      this.erro = 'Não foi possível acessar a câmera. Verifique as permissões.';
      console.error(err);
    }
  }

  capturarFoto() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (blob) {
        this.arquivoSelecionado = new File([blob], 'foto_camera.jpg', { type: 'image/jpeg' });
        this.visualizacao = URL.createObjectURL(blob);
        this.erro = null;
      }
    }, 'image/jpeg');

    if (this.arquivoSelecionado) {
      this.aoCapturar.emit(this.arquivoSelecionado);
    }

    this.fecharCamera();
  }

  fecharCamera() {
    if (this.fluxo) {
      this.fluxo.getTracks().forEach(track => track.stop());
      this.fluxo = null;
    }
    this.cameraAtiva = false;
  }

  trocarCamera() {
    this.modoCamera = this.modoCamera === 'user' ? 'environment' : 'user';
    this.fecharCamera();
    this.abrirCamera();
  }

  tirarNovamente() {
    this.visualizacao = null;
    this.abrirCamera();
  }

  continuar() {
    if (this.arquivoSelecionado) {
      this.aoContinuar.emit(this.arquivoSelecionado);
    } else {
      this.erro = 'Nenhuma imagem foi selecionada.';
    }
  }

  voltar() {
    this.aoVoltar.emit();
  }

  ngOnDestroy() {
    this.fecharCamera();
  }
}