import { Component, ElementRef, output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-component-self',
  imports: [],
  templateUrl: './component-self.html',
  styleUrl: './component-self.css'
})
export class ComponentSelf {
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
      this.avancar()
    }

    // Para o stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
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
}
