import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-home',
  templateUrl: './page-home.html',
  styleUrl: './page-home.css'
})
export class PageHome {
  constructor(private router: Router) {}

  irParaCadastro() {
    this.router.navigate(['/usuario']);
  }
}
