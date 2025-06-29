import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-success',
  templateUrl: './component-success.html',
  styleUrls: ['./component-success.css']
})
export class ComponentSuccess {
  @Output() onSubmitSection = new EventEmitter<number>();

  constructor(private router: Router) {}
  
  irParaHome() {
    console.log('Navigating to home');
    this.router.navigate(['/']);
  }
  finalizar(): void {
    this.onSubmitSection.emit(1);
    this.irParaHome();
  }
}
