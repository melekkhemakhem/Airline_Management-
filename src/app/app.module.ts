import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Your main component
import { EtudiantComponent } from './etudiant/etudiant.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FlightListComponent } from './flight-list/flight-list.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { FormsModule } from '@angular/forms';  // Add this import
import { RegistreComponent } from './registre/registre.component';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
@NgModule({
  declarations: [
    AppComponent,
    EtudiantComponent,
    FlightListComponent,
    HomeComponent,
    LoginComponent,
    ReservationFormComponent,
    ReservationListComponent,
    RegistreComponent,
    AdminComponent // Declare your main component here
    // Add other components if necessary
  ],
  imports: [
    BrowserModule,  // Browser module for web apps
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule

  ],
  providers: [
    // You don't need to explicitly provide HttpClient here
  ],
  bootstrap: [EtudiantComponent]  // Bootstraps the app with AppComponent
})
export class AppModule { }
