import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'; // para converter Observable em signal se desejar
import { DocumentoService } from '../../services/core/documentoServices';

@Component({
  selector: 'app-component-view-registrado',
  imports: [],
  templateUrl: './component-view-registrado.html',
  styleUrl: './component-view-registrado.css'
})
export class ComponentViewRegistrado implements OnInit {
  @Input() dados!: any; 

  usuarioExistenteService = inject(DocumentoService);
  userDados = signal<any | null>(null); 
  carregando = signal(true);

  ngOnInit() {
    console.log("registrado ", this.dados);
    this.usuarioExistenteService.encontarUsuarioBI(this.dados).subscribe(resp=>{
      console.log(resp);
    })

    console.log("finish ", this.dados);

  }
}
