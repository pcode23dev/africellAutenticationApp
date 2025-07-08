import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentHeader } from "../../components/component-header/component-header";

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.html',
  styleUrl: './page-home.css',
  imports: [ComponentHeader]
})
export class PageHome {
  constructor(private router: Router) {}

  irParaCadastro() {
    this.router.navigate(['/usuario']);
  }
  irParaAddCadastro() {
    this.router.navigate(['/usuarioRegistrado']);
  }
}
