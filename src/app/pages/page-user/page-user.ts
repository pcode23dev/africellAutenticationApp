import { Component, effect, inject } from '@angular/core';
import { ComponentFronteUpload } from "../../components/component-fronte-upload/component-fronte-upload";
import { ComponentHeader } from "../../components/component-header/component-header";
import { ComponentProgressBar } from "../../components/component-progress-bar/component-progress-bar";
import { ComponentVersoUpload } from "../../components/component-verso-upload/component-verso-upload";
import { Router } from '@angular/router';
import { ComponentForm } from "../../components/component-form/component-form";
import { ComponentSelf } from "../../components/component-self/component-self";
import { ComponentConfirm } from "../../components/component-confirm/component-confirm";
import { ComponentSuccess } from "../../components/component-success/component-success";
import { DocumentoService } from '../../services/core/documentoServices';

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.html',
  styleUrl: './page-user.css',
  imports: [ComponentFronteUpload, ComponentHeader, ComponentProgressBar, ComponentVersoUpload, ComponentForm, ComponentSelf, ComponentConfirm, ComponentSuccess]
})

export class PageUser {

  constructor(private router: Router) { }

  etapa = 0;
  dados: any = {};
  servicosUpload = inject(DocumentoService);
  avancarForm(dadosForm: any) {
    this.dados.form = dadosForm;
    this.etapa = 1;
    console.log(this.dados);

  }

  avancarFrente(imagem: File) {
    this.dados.frente = imagem;
    this.etapa = 2;
    console.log(this.dados);
  }

  avancarVerso(imagem: File) {
    this.dados.verso = imagem;
    this.etapa = 3;
    console.log(this.dados);
  }

  voltar() {
    if (this.etapa > 0) this.etapa--;
  }

  avancarSelfie(imagem: File) {
    this.dados.selfie = imagem;
    this.etapa = 4;
    console.log(this.dados);
    this.uploadImgem(this.dados);
  }

  avancarConfirmar(code: string) {
    this.dados.codeConfirm = code;
    this.etapa = 5;
    console.log(this.dados);
  }
  uploadImgem(dados: any) {
    const formData = new FormData();
    formData.append('form', JSON.stringify({
      nome: this.dados.form.nome,
      biNumber: this.dados.form.biNumber,
      phone: this.dados.form.phone,
      email: this.dados.form.email
    }));

    formData.append('frente', this.dados.frente);
    formData.append('verso', this.dados.verso);   
    formData.append('selfie',this.dados.selfie); 
    console.log(this.dados.selfie);
    console.log("update: ",formData);

    this.servicosUpload.criarDocumento(formData).subscribe({

      next: res => {
        console.log("Upload bem-sucedido", res);
        this.etapa = 6; // por exemplo
      },
      error: err => {
        console.error("Erro ao fazer upload", err);
      }
    });
  }

  finalizar(any: any) {
    this.router.navigate(['/']);
  }
}
