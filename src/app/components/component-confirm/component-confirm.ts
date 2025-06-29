import { Component, AfterViewInit, output } from '@angular/core';

@Component({
  selector: 'app-component-confirm',
  templateUrl: './component-confirm.html',
  styleUrls: ['./component-confirm.css']
})
export class ComponentConfirm implements AfterViewInit {
  ngAfterViewInit(): void {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.code-input'));
    inputs[0].focus();
    inputs.forEach((input, index) => {
      input.addEventListener('input', (event: Event) => {
        const current = event.target as HTMLInputElement;
        const value = current.value;

        // Apenas dígitos
        if (!/^\d$/.test(value)) {
          current.value = '';
          return;
        }

        // Move para o próximo input
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Backspace' && !input.value && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });

    const form = document.querySelector('.codigo-form') as HTMLFormElement;
    const message = document.getElementById('message') as HTMLElement;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const code = inputs.map(input => input.value).join('');
      if (code.length === 6) {
        console.log('Código confirmado:', code);
        message.textContent = 'Código confirmado com sucesso!';
        message.style.color = 'green';
        this.avancar();
      
      } else {
        message.textContent = 'Por favor, insira todos os 6 dígitos.';
        message.style.color = 'red';
      }
    });
  }

  onSubmitSection = output<number>();
  
  avancar() {
    this.onSubmitSection.emit(1);
  }
}
