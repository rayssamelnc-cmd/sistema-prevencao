import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-risco',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './risco.html',
  styleUrl: './risco.css',
})
export class Risco {

  async gerarPDF() {
    console.log('Iniciando geração do PDF de Risco Principal...');

    const elemento = document.querySelector('.tela-risco') as HTMLElement;

    if (!elemento) {
      console.error('Erro: O container .tela-risco não foi encontrado no HTML.');
      return;
    }

    const botao = elemento.querySelector('.btn-pdf') as HTMLElement;
    if (botao) botao.style.display = 'none';

    try {
      const opcoes = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollY: -window.scrollY
      };

      const canvas = await html2canvas(elemento, opcoes);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('analise-de-risco.pdf');
      console.log('PDF de análise de risco exportado com sucesso!');

    } catch (error) {
      console.error('Erro ao renderizar o PDF de análise de risco:', error);
    } finally {
      if (botao) botao.style.display = 'block';
    }
  }
}