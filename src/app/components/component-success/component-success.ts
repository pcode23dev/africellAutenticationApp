import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-success',
  templateUrl: './component-success.html',
  styleUrls: ['./component-success.css']
})
export class ComponentSuccess {
  @Output() aoFinalizar = new EventEmitter<void>();

  constructor(private router: Router) {}
  
  finalizar(): void {
    this.aoFinalizar.emit();
  }
}
