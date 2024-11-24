import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './registre.component.html',
  styleUrls: ['./registre.component.css']
})
export class RegistreComponent {

  credentials = { username: '', email: '', first_name: '', last_name: '',password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
  // Submit registration credentials
  onSubmit(): void {
    this.authService.register(this.credentials).subscribe(
      
      (data) => {
        console.log(this.credentials)
        console.log(data)
        this.router.navigate(['/login']);  // Navigate to login page after successful registration
      },
      (error) => {
        // If the backend provides specific error messages, show them
        if (error.error) {
          console.log(this.credentials)
          this.errorMessage = error.error.detail || 'Registration failed';  // Adjust according to your backend response structure
        } else {
          this.errorMessage = 'Registration failed due to unknown error';
        }
        console.error('Registration error', error);
      }
    );
  }
}
