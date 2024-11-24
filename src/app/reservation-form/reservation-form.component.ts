import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../reservation.service';
import { FlightService } from '../flight.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Importer CommonModule
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

interface Reservation {
  user: string;
  flight: string;
  date_reserved: Date;
}

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Importez CommonModule pour que ngFor fonctionne
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  email:string ='';
  errorMessage:string="";
  reservation: Reservation = { user: '', flight: '', date_reserved: new Date() };
  flights: any[] = [];
  reservations: any[] = []; // Liste des réservations

  constructor(
    private reservationService: ReservationService,
    private flightService: FlightService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute  // Injecter ActivatedRoute pour obtenir des paramètres de l'URL
  ) { }

  ngOnInit(): void {
    this.loadFlights();
    this.loadReservations();  // Charger les réservations existantes
  }

  // Charger la liste des vols
  loadFlights() {
    this.flightService.getFlights().subscribe(
      (data) => {
        this.flights = data;
      },
      (error) => {
        console.error('Erreur de chargement des vols:', error);
      }
    );
  }

  // Charger la liste des réservations
  loadReservations() {
    this.reservationService.getReservations().subscribe(
      (data) => {
        this.reservations = data;
      },
      (error) => {
        console.error('Erreur de chargement des réservations:', error);
      }
    );
  }

  // Soumettre la réservation
  onSubmit() {
    this.getUserId().then((userId) => {
      // Assurez-vous que l'ID utilisateur est bien assigné
      this.reservation.user = userId;
      console.log(this.reservation)
    this.reservationService.createReservation(this.reservation).subscribe(
      (data) => {
        alert('Réservation réussie!');
        this.router.navigate(['/reservations']);
      },
      (error) => {
        console.error('Erreur lors de la création de la réservation:', error);
      }
    );})
  }

  // Mettre à jour une réservation
  onUpdate(id: number) {
    this.reservationService.updateReservation(id, this.reservation).subscribe(
      (data) => {
        alert('Réservation mise à jour!');
        this.router.navigate(['/reservations']);
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la réservation:', error);
      }
    );
  }

  // Supprimer une réservation
  onDelete(id: number) {
    this.reservationService.deleteReservation(id).subscribe(
      (data) => {
        alert('Réservation supprimée!');
        this.loadReservations(); // Recharger la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de la réservation:', error);
      }
    );
  }
  getUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.reservationService.getUserIdByEmail(this.email).subscribe({
        next: (response) => {
         
          this.reservation.user = response.id;  // Récupère l'ID de l'utilisateur
          
          this.errorMessage = '';  // Réinitialiser le message d'erreur
          resolve(response.id);  // Retourne l'ID de l'utilisateur
        },
        error: (err) => {
          this.errorMessage = 'Utilisateur non trouvé.';
          reject(err);  // Retourne une erreur si l'utilisateur n'est pas trouvé
        }
      });
    });
  }
  logout() {
    this.authService.logout();  // Déconnecter l'utilisateur
  }
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
