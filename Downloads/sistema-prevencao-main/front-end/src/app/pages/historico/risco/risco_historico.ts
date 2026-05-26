import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-risco-historico',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './risco.html',
  styleUrl: './risco.css',
})
export class RiscoHistorico {

  fatores = [
    { nome: 'Doses esquecidas', desc: '3 esquecimentos esta semana', nivel: 'alto', emoji: '❌', pos: false },
    { nome: 'Vacina atrasada', desc: 'Tétano com reforço vencido', nivel: 'medio', emoji: '❌', pos: false },
    { nome: 'Doses adiadas', desc: 'Roacutan adiado 2x na semana', nivel: 'medio', emoji: '❌', pos: false },
    { nome: 'Boa adesão geral', desc: '86% de conformidade no mês', nivel: 'baixo', emoji: '✅', pos: true },
    { nome: 'Remédios activos', desc: 'Todos os toggles habilitados', nivel: 'baixo', emoji: '✅', pos: true }
  ];

  recomendacoes = [
    'Atualize o reforço da vacina de Tétano o quanto antes com seu médico.',
    'Evite adiar o Roacutan — tome sempre no horário programado.',
    'Ative as notificações do app para não esquecer as doses.',
    'Compartilhe este relatório com seu médico na próxima consulta.'
  ];

  async gerarPDF() {
    console.log('Iniciando geração do PDF de Histórico de Risco...');

    const elemento = document.querySelector('.aba-risco') as HTMLElement;

    if (!elemento) {
      console.error('Erro: O container .aba-risco não foi encontrado no HTML.');
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

      pdf.save('historico-analise-de-risco.pdf');
      console.log('PDF do histórico de risco exportado com sucesso!');

    } catch (error) {
      console.error('Erro ao renderizar o PDF do histórico de risco:', error);
    } finally {
      if (botao) botao.style.display = 'block';
    }
  }
}