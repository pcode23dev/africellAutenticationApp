import { Component, effect, output } from '@angular/core';
import { ComponentForm } from "../../components/component-form/component-form";
import { ComponentUploadDocument } from "../../components/component-upload-document/component-upload-document";
import { ComponentSelf } from "../../components/component-self/component-self";
import { ComponentConfirm } from "../../components/component-confirm/component-confirm";
import { ComponentSuccess } from "../../components/component-success/component-success";

@Component({
  selector: 'app-page-user',
  templateUrl: './page-user.html',
  styleUrl: './page-user.css',
  imports: [ComponentForm, ComponentUploadDocument, ComponentSelf, ComponentConfirm, ComponentSuccess]
})

export class PageUser {
  seccao: number = 0;

  nextSection(num: any) {
    if (this.seccao <= 4) {
      this.seccao = this.seccao + num;
    }
    console.log('Seccao atual:', this.seccao);
  }

}
