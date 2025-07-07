// src/app/services/id-analyzer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IdAnalyzerResponse {
  cropped: string;
  croppedface: string;
  matchrate: number;
  result: any;
  face: {
    isIdentical: boolean;
    confidence: string;
  };
}

@Injectable({ providedIn: 'root' })
export class IdAnalyzerService {
  private endpoint = 'https://api.idanalyzer.com';

  constructor(private http: HttpClient) {}

  uploadAndMatch(docBase64: string, selfieBase64: string): Observable<IdAnalyzerResponse> {
    const payload = {
      apikey: 'pzvEPa9yO238lNHAshnjKzztFVi17RII',
      file_base64: docBase64,
      face_base64: selfieBase64,
      outputimage: true,
      outputface: true,
      outputmode: 'base64',
      biometric_threshold: 0.5
    };
    return this.http.post<IdAnalyzerResponse>(this.endpoint, payload);
  }
}
