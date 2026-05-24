import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-historico-vacinas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacinas.html',
  styleUrl: './vacinas.css',
})
export class HistoricoVacinas {

  vacinas = [
    { nome: 'Hepatite B',    det: '12/03/2024 · 3ª dose',      s: 't' },
    { nome: 'Febre Amarela', det: '05/07/2019 · Dose única',    s: 't' },
    { nome: 'Tétano',        det: '18/01/2014 · Reforço vencido', s: 'e' },
  ];

  async gerarPDF() {
    console.log('Gerando PDF...');

    const elemento = document.querySelector('.aba-vacinas') as HTMLElement;

    if (!elemento) {
      console.error('Elemento não encontrado');
      return;
    }

    // Opcional: Esconde o botão temporariamente para ele não sair no PDF
    const botao = elemento.querySelector('.btn-pdf') as HTMLElement;
    if (botao) botao.style.display = 'none';

    try {
      const canvas = await html2canvas(elemento, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('cartao-vacinal.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      // Mostra o botão novamente após a geração
      if (botao) botao.style.display = 'block';
    }
  }
}


