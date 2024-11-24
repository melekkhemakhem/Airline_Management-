// src/app/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
//import { environment } from 'src/environments/environment';
 interface User {
  id?: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `http://localhost:8000/api/users/`;  // URL de l'API d'authentification
  private apiUrl2 = 'http://localhost:8000/api/users/email/id/'
  private userId: number | null = null;
  constructor(private http: HttpClient, private router: Router) { }
  // Méthode pour définir l'ID de l'utilisateur
  setUserId(id: number): void {
    this.userId = id;
  }

  // Méthode pour récupérer l'ID de l'utilisateur
  getUserId(): number | null {
    return this.userId;
  }

  // Méthode pour vérifier si un utilisateur est connecté
  isUserLoggedIn(): boolean {
    return this.userId !== null;
  }
  getUserIdByEmail(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.apiUrl2, { params });
  }
  getCurrentUser(): any {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        return jwtDecode(token); // Décoder le token pour récupérer l'utilisateur
      } catch (error) {
        console.error('Erreur lors du décodage du token', error);
        return null;
      }
    }
    return null;
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');  // Vérifie la présence du token dans localStorage
  }
 // Register method
 register(credentials: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}register/`, credentials);
}

// Get all users
getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.apiUrl);
}
  // Connexion de l'utilisateur
  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}login/`, credentials);
  }
  consulter(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`);
  }
  // Déconnexion de l'utilisateur
  logout(): void {
    localStorage.removeItem('token');  // Supprime le token du localStorage
    this.router.navigate(['/login']);
  }

  // Update user by ID
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.apiUrl}${id}/`, user);
  }
// Create a new user
createUser(user: User): Observable<any> {
  return this.http.post(this.apiUrl, user);
}
  // Delete user by ID
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
  // Get user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}/`);
  }
}
