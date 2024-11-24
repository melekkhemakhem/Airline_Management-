// src/app/reservation-list/reservation-list.component.ts

import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';  // Pour travailler avec les Observables
import { FlightService } from '../flight.service';
import { Router } from '@angular/router';

interface Reservation {
  user: string;
  flight: string;
  date_reserved: Date;
}

interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Importez CommonModule pour que ngFor fonctionne
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  reservation: Reservation = { user: '', flight: '', date_reserved: new Date() };  // Réservation unique
  reservations: Reservation[] = [];  // Tableau des réservations
  utilisateurs: User = { username: '', email: '', first_name: '', last_name: '', password: '' };  // Utilisateur connecté

  constructor(private reservationService: ReservationService,private flightService: FlightService, private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.loadReservations();
    console.log('idt',this.authService.getUserId())
  }

  loadReservations(): void {
    const id = this.authService.getUserId();  // Récupérer l'ID de l'utilisateur connecté
    this.reservationService.getReservations().subscribe(
      (data: Reservation[]) => {
        // Filtrer les réservations en fonction de l'ID de l'utilisateur connecté
        this.reservations = data.filter(reservation => Number(reservation.user) === id);
  
        // Pour chaque réservation, récupérer l'email de l'utilisateur et le vol associé
        for (let reservation of this.reservations) {
          // Récupérer l'email de l'utilisateur via la fonction getUtilisateurs
          this.getUtilisateurs(Number(reservation.user)).subscribe(
            (email: string) => {
              reservation.user = email;  // Mise à jour de la réservation avec l'email
            },
            (error) => {
              console.error('Erreur lors de la récupération de l\'email pour la réservation', reservation, error);
            }
          );
          this.getvol(Number(reservation.flight)).subscribe(
            (flight_number: string) => {
              reservation.flight = flight_number;  // Mise à jour de la réservation avec le numéro de vol
            },
            (error) => {
              console.error('Erreur lors de la récupération du vol pour la réservation', reservation, error);
            }
          );
        }
      },
      (error) => {
        console.error('Erreur de chargement des réservations:', error);
      }
    );
  }
  

  getUtilisateurs(id: number): Observable<string> {
    // Utiliser l'ID pour récupérer l'utilisateur et retourner son email
    
    return new Observable<string>((observer) => {
      this.authService.getUserById(id).subscribe(
        (data: User) => {
          
          observer.next(data.email);  // Envoi de l'email via observer
          observer.complete();
        },
        (error) => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
          observer.error(error);  // Envoi de l'erreur à l'observateur
        }
      );
    });
  }
  getvol(id: number): Observable<string> {
    // Utiliser l'ID pour récupérer l'utilisateur et retourner son email
    
    return new Observable<string>((observer) => {
      this.flightService.getFlight(id).subscribe(
        (data) => {
          
          observer.next(data.flight_number);  // Envoi de l'email via observer
          observer.complete();
        },
        (error) => {
          console.error('Erreur lors de la récupération des utilisateurs:', error);
          observer.error(error);  // Envoi de l'erreur à l'observateur
        }
      );
    });
  }
  logout() {
    this.authService.logout();  // Déconnecter l'utilisateur
  }
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
