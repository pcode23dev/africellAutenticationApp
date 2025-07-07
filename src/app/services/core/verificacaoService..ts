
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VerificacaoService {
    baseUrl = "";
    constructor(private http: HttpClient) {
        this.baseUrl = "http://localhost:3000/verificacao";
    }
    criarVeririfcacao(): Observable<any> {
        return this.http.get(`${this.baseUrl}/rastrear`);
    }
}
