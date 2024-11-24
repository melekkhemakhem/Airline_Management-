import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Etudiant {
  id: string;
  name: string;
  score: string;
}

interface EtudiantResponse {
  etudiant: Etudiant[];
}
@Injectable({
  providedIn: 'root'
})

export class ServiceService {

  private apiUrl = 'http://localhost:8080/demorest/api/etudiantres';  // URL de votre API

  constructor(private http: HttpClient) { }
// Fonction pour convertir un objet en XML (vous pouvez utiliser une bibliothèque ou le faire manuellement)
objectToXML(etudiant: Etudiant): string {
  return `<etudiant>
            <id>${etudiant.id}</id>
            <name>${etudiant.name}</name>
            <score>${etudiant.score}</score>
          </etudiant>`;
}
  getEtudiants(): Observable<EtudiantResponse> {
    return this.http.get<EtudiantResponse>(this.apiUrl);
  }
  // Ajouter un étudiant (en XML)
  addEtudiant(etudiant: Etudiant): Observable<Etudiant> {
    const xmlData = this.objectToXML(etudiant);
    const headers = new HttpHeaders().set('Content-Type', 'application/xml');
    return this.http.post<Etudiant>(`${this.apiUrl}/create`, xmlData, { headers });
  }
// Ajoutez cette méthode à votre service
updateEtudiant(id: string, etudiant: Etudiant): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, etudiant);
}
// Ajoutez cette méthode à votre service
deleteEtudiant(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

}
