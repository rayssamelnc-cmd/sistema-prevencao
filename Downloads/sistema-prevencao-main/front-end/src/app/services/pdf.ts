import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  gerarPDFVacinas() {

    console.log('Iniciando geração do PDF...');

    const el = document.getElementById('pdf-vacinas');

    if (!el) {
      console.error('Elemento pdf-vacinas não encontrado');
      return;
    }

    html2canvas(el).then(canvas => {

      const img = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      const width = 210;
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(img, 'PNG', 0, 0, width, height);

      pdf.save('vacinas.pdf');

      console.log('PDF gerado com sucesso!');
    });
  }
}