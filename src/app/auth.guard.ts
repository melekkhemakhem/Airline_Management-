// src/app/auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Service d'authentification

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Rediriger vers la page de login si non authentifié
      this.router.navigate(['/login']);
      return false;
    }
  }
  // canActivate(): boolean {
  //   const user = this.authService.getCurrentUser();
  //   if (user && user.username === 'melek') {
  //     return true; // Autorise l'accès
  //   } else {
  //     this.router.navigate(['/login']); // Redirige vers Home si non autorisé
  //     return false;
  //   }
  // }
}
