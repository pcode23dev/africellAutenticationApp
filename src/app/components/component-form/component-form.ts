import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-component-form',
  templateUrl: './component-form.html',
  styleUrl: './component-form.css',
  imports: [FormsModule]
})

export class ComponentForm {
  
  formRef: any;
  
  onSubmitSection = output<number>();
  
  constructor(private router: Router) {}
  
  irParaHome() {
    console.log('Navigating to home');
    this.router.navigate(['/']);
  }

  onSubmit(ttt: any) {
    this.onSubmitSection.emit(1);
  }

  
}
