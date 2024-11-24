// src/app/flight.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { environment } from 'src/environments/environment';  // Assurez-vous que l'URL de l'API est correcte

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private apiUrl = `http://localhost:8000/api/flights/`;  // URL de l'API des vols

  constructor(private http: HttpClient) { }

  // Obtenir la liste des vols
  getFlights(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtenir un vol par ID
  getFlight(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

  // Créer une nouvelle réservation
  createFlight(flightData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, flightData);
  }

  // Mettre à jour un vol
  updateFlight(id: number, flightData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, flightData);
  }

  // Supprimer un vol
  deleteFlight(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
