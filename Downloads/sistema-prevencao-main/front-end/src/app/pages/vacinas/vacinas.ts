import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfService } from '../../services/pdf';

@Component({
  selector: 'app-vacinas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vacinas.html',
  styleUrls: ['./vacinas.css']
})
export class Vacinas {

  abaAtiva: 'tomadas' | 'pendentes' = 'tomadas';

  constructor(private pdfService: PdfService) {}

  mudarAba(aba: 'tomadas' | 'pendentes') {
    this.abaAtiva = aba;
  }

  gerarPDF() {
    this.pdfService.gerarPDFVacinas();
  }
}