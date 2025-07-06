import { Component, ElementRef, ViewChild, Output, EventEmitter, OnDestroy, output } from '@angular/core';


@Component({
  selector: 'app-component-fronte-upload',
  imports: [],
  templateUrl: './component-fronte-upload.html',
  styleUrl: './component-fronte-upload.css'
})
export class ComponentFronteUpload implements OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;

  @Output() aoContinuar = new EventEmitter<File>();
  @Output() aoVoltar = new EventEmitter<void>();
  voltar() {
    this.aoVoltar.emit();
  }


  visualizacao: string | null = null;
  erro: string | null = null;
  cameraAtiva = false;
  fluxo: MediaStream | null = null;
  modoCamera: 'environment' | 'user' = 'environment';
  arquivoSelecionado: File | null = null;


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
      this.arquivoSelecionado = arquivo; // ← importante!
      const leitor = new FileReader();
      leitor.onload = (e: any) => {
        this.visualizacao = e.target.result; // apenas visualização
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

      this.cameraAtiva = true; // Ativa o bloco do vídeo

      setTimeout(() => {
        if (this.video && this.video.nativeElement) {
          this.video.nativeElement.srcObject = this.fluxo;
        }
      });

      this.erro = null;
      console.log("camera activa");
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
    if (this.arquivoSelecionado) {
      this.aoContinuar.emit(this.arquivoSelecionado);
    } else {
      this.erro = 'Nenhuma imagem foi selecionada.';
    }
  }


  ngOnDestroy() {
    this.fecharCamera();
  }

}
