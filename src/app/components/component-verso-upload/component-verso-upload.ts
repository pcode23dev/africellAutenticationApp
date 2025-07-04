import { Component, ElementRef, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-component-verso-upload',
  imports: [],
  templateUrl: './component-verso-upload.html',
  styleUrl: './component-verso-upload.css'
})
export class ComponentVersoUpload implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Output() aoContinuar = new EventEmitter<string>();
  @Output() aoVoltar = new EventEmitter<void>();

  visualizacao: string | null = null;
  erro: string | null = null;
  cameraAtiva = false;
  fluxo: MediaStream | null = null;
  modoCamera: 'environment' | 'user' = 'environment';

  abrirArquivo() {
    this.fileInput.nativeElement.click();
  }

  aoSelecionarArquivo(evento: Event) {
    const input = evento.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const arquivo = input.files[0];
      if (!arquivo.type.startsWith('image/')) {
        this.erro = 'Por favor, selecione apenas arquivos de imagem.';
        return;
      }
      if (arquivo.size > 5 * 1024 * 1024) {
        this.erro = 'O arquivo deve ter no máximo 5MB.';
        return;
      }
      const leitor = new FileReader();
      leitor.onload = (e: any) => {
        this.visualizacao = e.target.result;
        this.erro = null;
      };
      leitor.readAsDataURL(arquivo);
    }
  }

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
    this.visualizacao = canvas.toDataURL('image/jpeg');
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
    this.modoCamera = this.modoCamera === 'environment' ? 'user' : 'environment';
    this.fecharCamera();
    this.abrirCamera();
  }

  removerPreview() {
    this.visualizacao = null;
    this.erro = null;
    this.fileInput.nativeElement.value = '';
  }

  continuar() {
    this.aoContinuar.emit(this.visualizacao!);
  }

  voltar() {
    this.aoVoltar.emit();
  }

  ngOnDestroy() {
    this.fecharCamera();
  }
}