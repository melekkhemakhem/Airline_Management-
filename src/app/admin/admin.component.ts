import { Component, OnInit,ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { FlightService } from '../flight.service';
import { CommonModule, NgFor } from '@angular/common';
import { ReservationService } from '../reservation.service';
import { AuthService } from '../auth.service';
interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}
interface Reservation {
  user: string;
  flight: string;
  date_reserved: Date;
}
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule,NgFor,CommonModule, FormsModule], 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  users: User[] = [];
  user: User = { username: '', email: '', first_name: '', last_name: '', password: '' };
  isEdit: boolean = false; // Flag to track if we're editing or creating a user
  selectedUserId: number | null = null; // Store the ID of the selected user for editing
  email:string ='';
  errorMessage:string="";
  reservation: Reservation = { user: '', flight: '', date_reserved: new Date() };
  reservations: any[] = []; // Liste des réservations
  flights: any[] = []; // Liste des vols
  selectedFlight: any = null; // Vol sélectionné pour modification
  flightForm: FormGroup; // Formulaire pour créer/mettre à jour un vol
  isEditing: boolean = false; // Indique si nous sommes en mode édition
  selectedReservation: any = null;
  @ViewChild('us') u!: ElementRef;
  @ViewChild('reser') r!: ElementRef;
  @ViewChild('vols') v!: ElementRef;
  //reservationForm: FormGroup;
  isonUpdate: boolean = false;
  constructor(private cdr: ChangeDetectorRef,private flightService: FlightService,private reservationService: ReservationService,private authService: AuthService, private fb: FormBuilder) {
    // Initialisation du formulaire
    this.flightForm = this.fb.group({
      flight_number: [''],
      departure: [''],
      arrival: [''],
      date: [''],
      time: [''],
      price: [''],
    }); 
  
  }
  isMenuVisible: boolean = true;  // Variable pour contrôler l'affichage du menu
  currentSection: string = 'vols'; // Par défaut, la section des vols est affichée
  logout() {
    this.authService.logout();  // Déconnecter l'utilisateur
  }
   // Méthode pour gérer la sélection d'une section
   selectSection(): void {
    const log1 = this.u.nativeElement;
    log1.style.display = "block"; 
    const log2 = this.r.nativeElement;
    log2.style.display = "none"; 
    const log = this.v.nativeElement;
    log.style.display = "none";// Change la section actuellement visible
  }
  selectSection2(): void {
    const log1 = this.u.nativeElement;
    log1.style.display = "none"; 
    const log2 = this.r.nativeElement;
    log2.style.display = "block"; 
    const log = this.v.nativeElement;
    log.style.display = "none";  // Change la section actuellement visible
  }
  selectSection3(): void {
    const log1 = this.u.nativeElement;
    log1.style.display = "none"; 
    const log2 = this.r.nativeElement;
    log2.style.display = "none"; 
    const log = this.v.nativeElement;
    log.style.display = "block";  // Change la section actuellement visible
  }
  ngOnInit(): void {
    // Charger les vols et les réservations
    this.getAllFlights();
    this.getAllReservations();
    this.getUsers();  // Load users initially
  }
  
  getAllFlights(): void {
    this.flightService.getFlights().subscribe(
      (data) => {
        this.flights = data;
        
  
        // Une fois les vols récupérés, relier aux réservations si déjà disponibles
        if (this.reservations.length) {
          this.linkFlightDetailsToReservations();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des vols', error);
      }
    );
  }

  // Sélectionner un vol pour modification
  editFlight(flight: any): void {
    this.isEditing = true;
    this.selectedFlight = flight;
    this.flightForm.patchValue(flight);
  }

  // Réinitialiser le formulaire
  resetForm(): void {
    this.isEditing = false;
    this.selectedFlight = null;
    this.flightForm.reset();
  }

  // Ajouter ou mettre à jour un vol
  saveFlight(): void {
    if (this.isEditing) {
      // Mise à jour
      this.flightService
        .updateFlight(this.selectedFlight.id, this.flightForm.value)
        .subscribe(
          (response) => {
            alert('Vol mis à jour avec succès');
            this.resetForm();
            this.getAllFlights();
          },
          (error) => {
            console.error('Erreur lors de la mise à jour du vol', error);
          }
        );
    } else {
      // Création
      this.flightService.createFlight(this.flightForm.value).subscribe(
        (response) => {
          alert('Vol créé avec succès');
          this.resetForm();
          this.getAllFlights();
        },
        (error) => {
          console.error('Erreur lors de la création du vol', error);
        }
      );
    }
  }

  // Supprimer un vol
  deleteFlight(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce vol ?')) {
      this.flightService.deleteFlight(id).subscribe(
        (response) => {
          alert('Vol supprimé avec succès');
          this.getAllFlights();
        },
        (error) => {
          console.error('Erreur lors de la suppression du vol', error);
        }
      );
    }
  }

  //partie reservation pour admin

   // Obtenir toutes les réservations
   getAllReservations(): void {
    this.reservationService.getReservations().subscribe(
      (data) => {
        this.reservations = data;
        
  
        // Une fois les réservations récupérées, relier les vols si déjà disponibles
        if (this.flights.length) {
          this.linkFlightDetailsToReservations();
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des réservations', error);
      }
    );
  }
  
  // Méthode pour relier les détails des vols aux réservations
  linkFlightDetailsToReservations(): void {
    this.reservations = this.reservations.map((reservation) => {
      const flightDetails = this.flights.find((flight) => flight.id === reservation.flight);
      return { ...reservation, flight: flightDetails }; // Enrichir les données de réservation
    });
    
  }

  // // Ajouter ou mettre à jour une réservation

   // Soumettre la réservation
   // Soumettre la réservation (ajouter ou mettre à jour)
   // Méthode pour obtenir l'ID de l'utilisateur par e-mail
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
  onSubmit() {
    
    
    // Attendez que la méthode getUserId() soit résolue pour obtenir l'ID
    this.getUserId().then((userId) => {
      // Assurez-vous que l'ID utilisateur est bien assigné
      this.reservation.user = userId;
      
  
      if (this.selectedReservation) {
        // Si nous sommes en mode modification
        this.reservationService.updateReservation(this.selectedReservation.id, this.reservation).subscribe(
          (data) => {
            alert('Réservation mise à jour!');
            this.resetReservationForm(); // Réinitialiser après mise à jour
            this.getAllReservations(); // Recharger la liste des réservations
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de la réservation:', error);
          }
        );
      } else {
        // Si nous sommes en mode ajout
        this.reservationService.createReservation(this.reservation).subscribe(
          (data) => {
            alert('Réservation réussie!');
            this.resetReservationForm(); // Réinitialiser après ajout
            this.getAllReservations(); // Recharger la liste des réservations
          },
          (error) => {
            console.error('Erreur lors de la création de la réservation:', error);
          }
        );
      }
    }).catch((error) => {
      console.error("Erreur lors de la récupération de l'ID utilisateur", error);
    });
  }
  


  // Mettre à jour une réservation
  onUpdate(id: number) {
    this.reservationService.updateReservation(id, this.reservation).subscribe(
      (data) => {
        alert('Réservation mise à jour!');
        
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
        this.getAllReservations(); // Recharger la liste après suppression
      },
      (error) => {
        console.error('Erreur lors de la suppression de la réservation:', error);
      }
    );
  }

  // Sélectionner une réservation pour modification
editReservation(reservation: any): void {
  this.selectedReservation = reservation; // Enregistrer la réservation sélectionnée
  this.reservation = { ...reservation }; // Charger les informations de la réservation dans le formulaire
}

// Réinitialiser le formulaire de réservation
resetReservationForm(): void {
  this.selectedReservation = null; // Réinitialiser la réservation sélectionnée
  this.reservation = { user: '', flight: '', date_reserved: new Date() }; // Réinitialiser les valeurs du formulaire
  this.email='';
}



 // Fetch all users
 getUsers(): void {
  this.authService.getUsers().subscribe(
    data => {
      this.users = data;
    },
    error => {
      console.error('Error fetching users', error);
    }
  );
}

// Fetch user by ID for editing
getUserById(id: number): void {
  this.authService.getUserById(id).subscribe(
    data => {
      this.user = data;
      this.isEdit = true;
      this.selectedUserId = id;
    },
    error => {
      console.error('Error fetching user', error);
    }
  );
}

// Save the user (create or update)
save(): void {
  if (this.isEdit) {
    // Update the user
    this.authService.updateUser(this.selectedUserId as number, this.user).subscribe(() => {
      this.getUsers(); // Refresh the user list
      this.resetForm(); // Reset the form
    });
  } else {
    // Create a new user
    this.authService.createUser(this.user).subscribe(() => {
      this.getUsers(); // Refresh the user list
      this.resetForm(); // Reset the form
    });
  }
}

// Delete user
deleteUser(id: number): void {
  if (confirm('Are you sure you want to delete this user?')) {
    this.authService.deleteUser(id).subscribe(() => {
      this.getUsers();  // Refresh the list after deletion
    });
  }
}

// Reset form for creating a new user
resetForm2(): void {
  this.user = { username: '', email: '', first_name: '', last_name: '', password: '' };
  this.isEdit = false;
  this.selectedUserId = null;
}

// Set the form for editing a user
editUser(id: number | undefined): void {
  if (id !== undefined) {
    this.getUserById(id); // Appeler la fonction si l'ID est défini
  } else {
    console.error('User ID is undefined');
  }
}


// Toggle between list and form view
toggleForm(): void {
  this.isEdit = false;
  this.resetForm(); // Reset the form and switch to create mode
}
}
