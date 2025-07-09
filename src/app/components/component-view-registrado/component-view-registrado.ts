
import { Component, computed, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { DocumentoService } from '../../services/core/documentoServices';

@Component({
  selector: 'app-component-view-registrado',
  imports: [],
  templateUrl: './component-view-registrado.html',
  styleUrl: './component-view-registrado.css'
})
export class ComponentViewRegistrado implements OnInit {
  @Input() dados!: any;
  @Input() tel!: string;

  @Output() aoCOntinuar = new EventEmitter<string>();

  usuarioExistenteService = inject(DocumentoService);
  userDados = signal<any | null>(null);
  carregando = signal<boolean>(true);
  imagens = signal<string[]>([]);

  ngOnInit() {
    this.usuarioExistenteService.encontarUsuarioBI(this.dados).subscribe(resp => {
      this.userDados.set(resp);

      const frente = resp.usurio?.imagem_bi_frente;
      const verso = resp.usurio?.imagem_bi_verso;
      const selfie = resp.usurio?.selfie;

      const lista = [frente, verso, selfie].filter(Boolean);
      this.imagens.set(lista);

      console.log('Imagens carregadas:', this.imagens());
      this.carregando.set(false);
    });
  }

  // Signal para índice atual
  currentIndex = signal(0);

  // Computed para aplicar a transformação no carrossel
  currentTransform = computed(() => `translateX(-${this.currentIndex()}00%)`);

  next() {
    this.currentIndex.update(i => (i + 1) % this.imagens().length);
  }

  prev() {
    this.currentIndex.update(i => (i - 1 + this.imagens().length) % this.imagens().length);
  }

  mostrarDetalhes = signal(false);

  alternarDetalhes() {
    this.mostrarDetalhes.set(!this.mostrarDetalhes());
  }

  continuar() {
    this.carregando.set(true);
    this.usuarioExistenteService.RegistarUsuario(this.dados).subscribe(resp => {
      console.log(resp);
      this.aoCOntinuar.emit(resp);
      console.log("Resposta cadastro no banco: ", resp);
    })
  }

}
