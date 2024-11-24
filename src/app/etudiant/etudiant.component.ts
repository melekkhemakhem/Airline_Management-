import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { CommonModule } from '@angular/common';  // Importer CommonModule
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Etudiant {
  id: string;
  name: string;
  score: string;
}
@Component({
  selector: 'app-etudiant',
  standalone: true,
  imports: [CommonModule,FormsModule],  // Importez CommonModule pour que ngFor fonctionne
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})

export class EtudiantComponent implements OnInit {
  etudiants: any[] = [];  // Liste vide au départ
  newEtudiant: Etudiant = { id: '', name: '', score: '' };
  constructor(private etudiantService: ServiceService) {}

  ngOnInit(): void {
    this.loadEtudiants();
  }
  loadEtudiants(): void {
    this.etudiantService.getEtudiants().subscribe((data) => {
      // Accédez à la clé 'etudiant' qui contient le tableau
      this.etudiants = data.etudiant;  // Accès correct à 'etudiant'
      console.log(this.etudiants);
    });
  }
  addEtudiant(): void {
    this.etudiantService.addEtudiant(this.newEtudiant).subscribe((data) => {
      this.etudiants.push(data);
      this.newEtudiant = { id: '', name: '', score: '' };  // Réinitialiser le formulaire
    });
  }

  updateEtudiant(id: string, etudiant: Etudiant): void {
    this.etudiantService.updateEtudiant(id, etudiant).subscribe(() => {
      alert('Etudiant mis à jour');
      this.loadEtudiants();
    });
  }

  deleteEtudiant(id: string): void {
    this.etudiantService.deleteEtudiant(id).subscribe(() => {
      alert('Etudiant supprimé');
      this.loadEtudiants();
    });
  }
}
