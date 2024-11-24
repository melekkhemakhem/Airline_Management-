import { Component, OnInit } from '@angular/core';
import { FlightService } from '../flight.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css']
})
export class FlightListComponent implements OnInit {

  flights: any[] = [];
  availableDepartures: string[] = [];
  availableArrivals: string[] = [];
  searchFilters = {
    tripType: 'Round_trip',
    from: '',
    to: '',
    departDate: '',
    numPassengers: 1
  };
  searchClicked: boolean = false; // Contrôle l'affichage des résultats


  constructor(private flightService: FlightService,private authService: AuthService,private router: Router) { }

  ngOnInit(): void {
    this.loadFlights();
  }

  loadFlights() {
    this.flightService.getFlights().subscribe(
      (data) => {
        this.flights = data;
        this.populateFilterOptions(data); // Populate available cities for From/To
        console.log(this.flights);
      },
      (error) => {
        console.error('Erreur de chargement des vols:', error);
      }
    );
  }

  populateFilterOptions(flights: any[]) {
    // Récupère les villes de départ et d'arrivée disponibles
    this.availableDepartures = [...new Set(flights.map(flight => flight.departure))];
    this.availableArrivals = [...new Set(flights.map(flight => flight.arrival))];
  }

  filterFlights() {
    this.searchClicked = true; // Affiche les résultats après le clic sur Search
    // Applique les filtres
    return this.flights.filter(flight => {
      return (
        (this.searchFilters.from ? flight.departure === this.searchFilters.from : true) &&
        (this.searchFilters.to ? flight.arrival === this.searchFilters.to : true) &&
        (this.searchFilters.departDate ? flight.date === this.searchFilters.departDate : true) &&
        (this.searchFilters.tripType === 'Round_trip' ? true : false) // Filtre par type de voyage
      );
    });
  }
  navigateToReservations() {
    this.router.navigate(['/reservation-form']);
  }
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
  logout() {
    this.authService.logout();  // Déconnecter l'utilisateur
  }
}

