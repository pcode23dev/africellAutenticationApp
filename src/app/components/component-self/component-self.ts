import { Component, ElementRef, output, ViewChild, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-component-self',
  imports: [],
  templateUrl: './component-self.html',
  styleUrl: './component-self.css'
})
export class ComponentSelf implements OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;

  imagemCapturada: string | null = null;
  stream: MediaStream | null = null;

  ngAfterViewInit() {
    this.iniciarStream();
  }

  iniciarStream() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Erro ao acessar a câmera:', error);
      });
  }

  capturar() {
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imagemCapturada = canvas.toDataURL('image/jpeg');
      // Para o stream
      this.pararStream();
      this.avancar();
    }
  }

  repetirFoto() {
    this.imagemCapturada = null;
    this.iniciarStream();
  }

  enviarImagem() {
    console.log('Imagem capturada:', this.imagemCapturada);
  }

  onSubmitSection = output<number>();

  avancar() {
    this.onSubmitSection.emit(1);
  }

  pararStream() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
      if (this.videoElement?.nativeElement) {
        this.videoElement.nativeElement.srcObject = null;
      }
    }
  }

  ngOnDestroy() {
    this.pararStream();
  }
}