import { RouterModule, Routes } from '@angular/router';
import { EtudiantComponent } from './etudiant/etudiant.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { AuthGuard } from './auth.guard';
import { RegistreComponent } from './registre/registre.component';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    {path: "test", component:EtudiantComponent},
    { path: 'home', component: HomeComponent ,canActivate: [AuthGuard]},
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'flights', component: FlightListComponent, canActivate: [AuthGuard] },
  { path: 'reservations', component: ReservationListComponent, canActivate: [AuthGuard] },
  { path: 'reservation-form', component: ReservationFormComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
// { path: 'flights', component: FlightListComponent },
// { path: 'reservations', component: ReservationListComponent},
// { path: 'reservation-form', component: ReservationFormComponent },
{ path: 'registre', component: RegistreComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }