import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DocumentoService {
    baseUrl = "";
    constructor(private http: HttpClient) {
        this.baseUrl = "http://localhost:3000/utilizador";
    }
    criarDocumento(formData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/registarNovo`, formData);
    }
}