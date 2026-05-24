import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
 
@Component({
  selector: 'app-historico-remedios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './remedios.html',
  styleUrl: './remedios.css',
})
export class HistoricoRemedios {
 
  semana = [
    { l: 'D', n: 20, s: 't' },
    { l: 'S', n: 21, s: 't' },
    { l: 'T', n: 22, s: 'e' },
    { l: 'Q', n: 23, s: 't' },
    { l: 'Q', n: 24, s: 't' },
    { l: 'S', n: 25, s: 'e' },
    { l: 'S', n: 26, s: 'p' },
  ];
 
  registros = [
    { nome: 'Dipirona', det: 'Hoje · 10:02',  s: 't' },
    { nome: 'Roacutan', det: 'Ontem · 18:15', s: 'e' },
    { nome: 'Xultophy', det: 'Ontem · 09:50', s: 't' },
    { nome: 'Dipirona', det: '22/04 · 10:05', s: 't' },
  ];
 
  async gerarPDF() {
    console.log('Iniciando geração do PDF de Remédios...');

    const elemento = document.querySelector('.aba-remedios') as HTMLElement;

    if (!elemento) {
      console.error('Erro: O container .aba-remedios não foi encontrado no HTML.');
      return;
    }

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

      pdf.save('historico-remedios.pdf');
    } catch (error) {
      console.error('Erro ao processar o PDF de remédios:', error);
    } finally {
      if (botao) botao.style.display = 'block';
    }
  }
}