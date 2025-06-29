import { Component, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-component-upload-document',
  templateUrl: './component-upload-document.html',
  styleUrls: ['./component-upload-document.css']
})
export class ComponentUploadDocument implements AfterViewInit {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  stream: MediaStream | null = null;
  imagemCapturada: string | null = null;

  @Output() onSubmitSection = new EventEmitter<number>();

  constructor() { }

  ngAfterViewInit(): void {
    this.iniciarStream();
  }

  iniciarStream(): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.stream = stream;
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(error => {
        console.error('Erro ao acessar a webcam:', error);
      });
  }

  capturar(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const contexto = canvas.getContext('2d');
    if (contexto) {
      contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.imagemCapturada = canvas.toDataURL('image/png');
      document.querySelector('.preview-container')?.classList.remove('d-none');
      document.querySelector('.component-camera')?.classList.add('d-none');
    }
  }

  enviarImagem(): void {
    if (this.imagemCapturada) {
      console.log('Enviando imagem:', this.imagemCapturada);
      // Aqui você pode fazer um POST para seu backend, por exemplo
    }
  }

  repetirFoto(): void {
    this.imagemCapturada = null;
    document.querySelector('.component-camera')?.classList.remove('d-none');
    document.querySelector('.preview-container')?.classList.add('d-none');
    this.iniciarStream();
  }

  avancar(): void {
    this.onSubmitSection.emit(1);
  }
}
