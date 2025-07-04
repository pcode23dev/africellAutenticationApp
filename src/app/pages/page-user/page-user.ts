import { Component } from '@angular/core';
import { ComponentFronteUpload } from "../../components/component-fronte-upload/component-fronte-upload";
import { ComponentHeader } from "../../components/component-header/component-header";
import { ComponentProgressBar } from "../../components/component-progress-bar/component-progress-bar";
import { ComponentVersoUpload } from "../../components/component-verso-upload/component-verso-upload";
import { Router } from '@angular/router';
import { ComponentForm } from "../../components/component-form/component-form";

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.html',
  styleUrl: './page-user.css',
  imports: [ComponentFronteUpload, ComponentHeader, ComponentProgressBar, ComponentVersoUpload, ComponentForm]
})

export class PageUser {

  constructor(private router: Router) { }

  etapa = 0;
  dados: any = {};

  avancarForm(dadosForm: any) {
    this.dados.form = dadosForm;
    this.etapa = 1; 
  }

  avancarFrente(imagem: string) {
    this.dados.frente = imagem;
    this.etapa = 2;
  }

  avancarVerso(imagem: string) {
    this.dados.verso = imagem;
    this.etapa = 3;
  }

  voltar() {
    this.etapa--;
  }

  avancarSelfie(imagem: string) {
    this.dados.selfie = imagem;
    this.etapa = 4;
  }
}
