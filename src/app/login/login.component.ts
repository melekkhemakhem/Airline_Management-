import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Importez CommonModule pour que ngFor fonctionne
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  credentials = { username: '', password: '' };
  errorMessage = '';
  id = '';  // Initialisation de l'ID comme une chaîne vide
  public utilisateurs: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,  
  ) {}

  ngOnInit(): void {
    
  }

  getUtilisateurs(): void {
    this.authService.consulter().subscribe(
      (data) => {
        this.utilisateurs = data;  // Stocker les données dans la variable
        //console.log('Données des utilisateurs:', this.utilisateurs);
        
        // Afficher uniquement les usernames dans la console
        this.utilisateurs.forEach(utilisateur => {
          //console.log('Username:', utilisateur.password);
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    );
  }

  async getUserId(): Promise<string> {
    return new Promise((resolve, reject) => {
      const email = this.credentials.username;
      this.authService.getUserIdByEmail(email).subscribe({
        next: (response) => {
          this.id = response.id;  // Récupère l'ID de l'utilisateur
          
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

  // Submit login credentials
  async onSubmit_user(): Promise<void> {
    try {
      const userId = await this.getUserId();  // Attendre la résolution de getUserId()

      this.authService.setUserId(Number(userId));  // Assurez-vous que l'ID est correctement défini
      //console.log(this.authService.getUserId());  // Afficher l'ID de l'utilisateur

      localStorage.setItem('token', 'fake-access-token');  // Stocker le token (vous pouvez ajuster selon votre API)

      if (this.credentials.username === "khemakhem.melek123@gmail.com") {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);  // Naviguer vers la page d'accueil
      }
    } catch (error) {
      this.errorMessage = 'Utilisateur non trouvé.';
      console.error('Login error', error);
    }
  }

  // Fonction de fallback pour le login si vous préférez une méthode synchrone
  // onSubmit(): void {
  //   this.utilisateurs.forEach(utilisateur => {
  //     const pwd = utilisateur.password;
  //     const user = utilisateur.username;
  //     if (this.credentials.username == user && this.credentials.password == pwd) {
  //       this.router.navigate(['/flights']);
  //     }
  //   });
  // }
}
