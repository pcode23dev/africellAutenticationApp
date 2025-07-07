import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentoService } from '../../services/core/documentoServices';
import { ComponentHeader } from '../../components/component-header/component-header';
import { ComponentProgressBar } from '../../components/component-progress-bar/component-progress-bar';
import { ComponentFronteUpload } from '../../components/component-fronte-upload/component-fronte-upload';
import { ComponentConfirm } from '../../components/component-confirm/component-confirm';
import { ComponentForm } from '../../components/component-form/component-form';
import { ComponentSelf } from '../../components/component-self/component-self';
import { ComponentSuccess } from '../../components/component-success/component-success';

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.html',
  styleUrl: './page-user.css',
  imports: [
    ComponentHeader, ComponentProgressBar,
    ComponentForm, ComponentFronteUpload,
    ComponentSelf, ComponentConfirm,
    ComponentSuccess
  ]
})
export class PageUser {


  etapa = 0;
  dados: any = {};
  visualizacaoDocumento: string = '';
  private documentoService = inject(DocumentoService);
  private router = inject(Router);

  avancarForm(form: any) {
    this.dados.form = form;
    this.etapa = 1;
  }

  avancarFrente(file: File) {
    this.dados.frente = file;

    this.toBase64(file).then(b64 => {
      this.visualizacaoDocumento = b64;  // Base64 com prefixo data:image
      this.etapa = 2;  // só vamos para selfie quando o Base64 estiver pronto
    });
  }


  voltar() {
    if (this.etapa > 0) this.etapa--;
  }



  onSelfieFinalizada(res: {
    docImg: string;
    faceDocImg: string;
    selfieImg: string;
    result: any;
    matchrate: number;
  }) {
    const api = res.result;

    this.dados = {
      form: {
        nome: api.firstName + ' ' + api.lastName,
        nacionalidade: api.nationality_full,
        biNumber: api.documentNumber,
        telefone: this.dados.form.phone,
        email: this.dados.form.email
      },
      sideDocumento: api.documentSide,
      arquivos: {
        fileDocCropped: this.dataURLtoFile(res.docImg, 'doc_cropped.jpg'),
        fileFaceCropped: this.dataURLtoFile(res.faceDocImg, 'face_cropped.jpg'),
        fileSelfieCropped: this.dataURLtoFile(res.selfieImg, 'selfie_cropped.jpg')
      }
    };

  
    this.etapa = 3;
  }


  avancarConfirmar(code: string) {
    this.dados.codeConfirm = code;
    console.log('Dados preparados:', this.dados);
    this.etapa = 4;
  }

  finalizar() {
    this.router.navigate(['/']);
  }

  // Preenche automaticamente campos do form com dados da API
  preencherFormulario(apiRes: any) {
    this.dados.form.nome = apiRes.firstName + ' ' + apiRes.lastName;
    this.dados.form.biNumber = apiRes.documentNumber;
  }

  async uploadFinal() {
    const fd = new FormData();
    fd.append('form', JSON.stringify(this.dados.form));
    fd.append('sideDocumento', this.dados.sideDocumento);
    fd.append('fileDocCropped', this.dados.arquivos.fileDocCropped);
    fd.append('fileFaceCropped', this.dados.arquivos.fileFaceCropped);
    fd.append('fileSelfieCropped', this.dados.arquivos.fileSelfieCropped);

    this.documentoService.criarDocumento(fd).subscribe({
      next: () => this.etapa = 4,
      error: err => console.error('Erro no envio final', err)
    });
  }


  private toBase64(file: File): Promise<string> {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }


  private dataURLtoFile(dataURL: string, filename: string): File {
    const base64 = dataURL.includes(',')
      ? dataURL.split(',')[1].replace(/\s/g, '')
      : dataURL.replace(/\s/g, '');

    const binary = window.atob(base64);
    const len = binary.length;
    const u8arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      u8arr[i] = binary.charCodeAt(i);
    }
    return new File([u8arr], filename, { type: 'image/jpeg' });
  }


}
