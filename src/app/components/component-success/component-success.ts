import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-success',
  templateUrl: './component-success.html',
  styleUrls: ['./component-success.css']
})
export class ComponentSuccess implements OnInit {
  @Output() aoFinalizar = new EventEmitter<void>();
  @Input() msg!: any;

  ngOnInit(): void {
      this.msg.set(this.msg);
  }
  
  constructor(private router: Router) {}
  
  finalizar(): void {
    this.aoFinalizar.emit();
  }
}
