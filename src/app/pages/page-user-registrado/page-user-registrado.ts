import { Component, inject, Output, signal } from '@angular/core';
import { ComponentHeader } from "../../components/component-header/component-header";
import { ComponentProgressBar } from "../../components/component-progress-bar/component-progress-bar";
import { ComponentSuccess } from "../../components/component-success/component-success";
import { DocumentoService } from '../../services/core/documentoServices';
import { Router } from '@angular/router';
import { ComponentFormRegistrado } from "../../components/component-form-registrado/component-form-registrado";
import { ComponentViewRegistrado } from "../../components/component-view-registrado/component-view-registrado";
import { ComponentUploadDocRegistrado } from "../../components/component-upload-doc-registrado/component-upload-doc-registrado";

@Component({
  selector: 'app-page-user-registrado',
  imports: [ComponentHeader, ComponentProgressBar, ComponentSuccess, ComponentFormRegistrado, ComponentViewRegistrado, ComponentUploadDocRegistrado],
  templateUrl: './page-user-registrado.html',
  styleUrl: './page-user-registrado.css'
})

export class PageUserRegistrado {
  
  etapa = 0;
  dados: any = {};
  visualizacaoDocumento: string = '';
  private documentoService = inject(DocumentoService);
  private router = inject(Router);
  @Output() inpTel = signal<string>('');

  avancarForm(form: any) {
    this.dados.form = form;
    this.inpTel.set(this.dados.form.phone)
    this.etapa = 1;
    console.log("etapa: ", this.etapa,"\n  dasdos", this.dados);
  }

  avancarFrente(bi: string) {
    this.dados.form.biNumber = bi;
    this.etapa = 2;  
    console.log("etapa: ", this.etapa, "\ndadaos " ,this.dados);

  }

  voltar() {
    if (this.etapa > 0) this.etapa--;
  }


  avancarConfirmar(code: string) {
    this.dados.codeConfirm = code;
    this.uploadFinal();
    console.log('Dados preparados:', this.dados);
    this.etapa = 4;
    console.log("etapa: ", this.etapa);
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
