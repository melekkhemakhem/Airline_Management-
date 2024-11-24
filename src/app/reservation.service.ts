// src/app/reservation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { environment } from 'src/environments/environment';  // Assurez-vous que l'URL de l'API est correcte

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = `http://localhost:8000/api/reservations/`;  // URL de l'API des réservations
  private apiUrl2 = 'http://localhost:8000/api/users/email/id/';
  constructor(private http: HttpClient) { }
  getUserIdByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.apiUrl2, { params });
  }
  // Obtenir la liste des réservations
  getReservations(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Obtenir une réservation par ID
  getReservation(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }

// Créer une nouvelle réservation
createReservation(reservationData: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, reservationData);
}
  // Mettre à jour une réservation
  updateReservation(id: number, reservationData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${id}/`, reservationData);
  }

  // Supprimer une réservation
  deleteReservation(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${id}/`);
  }
}
