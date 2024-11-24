// src/app/home/home.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService, private router: Router) {}
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
  logout() {
    this.authService.logout();  // Déconnecter l'utilisateur
  }
}
