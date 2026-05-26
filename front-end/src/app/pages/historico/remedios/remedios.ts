import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
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
    console.log('Iniciando geração do relatório de medicamentos em formato A4...');

    const relatorioContainer = document.createElement('div');
    relatorioContainer.style.position = 'fixed';
    relatorioContainer.style.top = '-10000px';
    relatorioContainer.style.left = '-10000px';
    relatorioContainer.style.width = '210mm';
    relatorioContainer.style.minHeight = '297mm';
    relatorioContainer.style.backgroundColor = '#ffffff';
    relatorioContainer.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    relatorioContainer.style.color = '#333333';
    relatorioContainer.style.padding = '20mm';
    relatorioContainer.style.boxSizing = 'border-box';

    const linhasCalendario = this.semana.map(d => {
      let statusTexto = 'Pendente';
      let corStatus = '#757575';
      if (d.s === 't') { statusTexto = 'Tomado'; corStatus = '#2e7d32'; }
      if (d.s === 'e') { statusTexto = 'Esquecido'; corStatus = '#c62828'; }

      return `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 8px; font-weight: bold;">Dia ${d.n} (${d.l})</td>
          <td style="padding: 8px; color: ${corStatus}; font-weight: bold;">${statusTexto}</td>
        </tr>
      `;
    }).join('');

    const linhasRegistros = this.registros.map(r => {
      const statusTexto = r.s === 't' ? 'Tomado' : 'Esquecido';
      const corBadge = r.s === 't' ? 'background-color: #e8f5e9; color: #2e7d32;' : 'background-color: #ffebee; color: #c62828;';

      return `
        <tr style="border-bottom: 1px solid #eeeeee;">
          <td style="padding: 10px; font-weight: bold; color: #333;">${r.nome}</td>
          <td style="padding: 10px; color: #666666;">${r.det}</td>
          <td style="padding: 10px; text-align: right;">
            <span style="padding: 4px 10px; border-radius: 3px; font-size: 11px; font-weight: bold; ${corBadge}">
              ${statusTexto}
            </span>
          </td>
        </tr>
      `;
    }).join('');

    relatorioContainer.innerHTML = `
      <div style="border-bottom: 2px solid #43a047; padding-bottom: 8px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="margin: 0; font-size: 24px; color: #43a047; font-weight: bold; letter-spacing: 0.5px;">SISTEMA PREVENÇÃO</h1>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666666;">Relatório Clínico de Adesão Medicamentosa</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0; font-size: 12px; color: #333;"><strong>Data de Emissão:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
          <p style="margin: 3px 0 0 0; font-size: 11px; color: #888888;">Histórico do Paciente</p>
        </div>
      </div>

      <div style="display: flex; gap: 20px; margin-bottom: 30px;">
        <div style="flex: 1; background-color: #e8f5e9; border-left: 6px solid #43a047; padding: 15px; border-radius: 4px;">
          <h3 style="margin: 0 0 5px 0; color: #1b5e20; font-size: 12px; text-transform: uppercase;">Doses Tomadas esta Semana</h3>
          <p style="margin: 0; font-size: 26px; font-weight: bold; color: #2e7d32;">18</p>
        </div>
        <div style="flex: 1; background-color: #f3e5f5; border-left: 6px solid #9c27b0; padding: 15px; border-radius: 4px;">
          <h3 style="margin: 0 0 5px 0; color: #4a148c; font-size: 12px; text-transform: uppercase;">Doses Esquecidas</h3>
          <p style="margin: 0; font-size: 26px; font-weight: bold; color: #7b1fa2;">3</p>
        </div>
        <div style="flex: 1; background-color: #e3f2fd; border-left: 6px solid #1e88e5; padding: 15px; border-radius: 4px;">
          <h3 style="margin: 0 0 5px 0; color: #0d47a1; font-size: 12px; text-transform: uppercase;">Adesão do Mês</h3>
          <p style="margin: 0; font-size: 26px; font-weight: bold; color: #1976d2;">86% <span style="font-size: 12px; font-weight: normal; color: #2e7d32;">(Boa)</span></p>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 14px; color: #2e7d32; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          📅 Monitoramento Diário da Semana
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; background-color: #fafafa;">
          <thead>
            <tr style="background-color: #eeeeee; text-align: left;">
              <th style="padding: 8px; color: #555;">Identificação do Dia</th>
              <th style="padding: 8px; color: #555;">Status de Tomada</th>
            </tr>
          </thead>
          <tbody>
            ${linhasCalendario}
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 40px;">
        <h2 style="font-size: 14px; color: #2e7d32; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
          📋 Últimos Registros de Atividade
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="background-color: #f5f5f5; text-align: left;">
              <th style="padding: 10px; border: 1px solid #dddddd; color: #555;">Medicamento</th>
              <th style="padding: 10px; border: 1px solid #dddddd; color: #555;">Data / Hora do Evento</th>
              <th style="padding: 10px; border: 1px solid #dddddd; text-align: right; color: #555;">Situação</th>
            </tr>
          </thead>
          <tbody>
            ${linhasRegistros}
          </tbody>
        </table>
      </div>

      <div style="margin-top: auto; border-top: 1px solid #eeeeee; padding-top: 15px; text-align: center; font-size: 11px; color: #999999;">
        <p style="margin: 0;">Este documento foi gerado automaticamente a partir dos dados locais de registro de medicamentos.</p>
        <p style="margin: 4px 0 0 0;">Página 1 de 1 — Documento de caráter informativo para suporte e acompanhamento terapêutico.</p>
      </div>
    `;

    document.body.appendChild(relatorioContainer);

    try {
      const opcoes: any = {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      };

      const canvas = await html2canvas(relatorioContainer, opcoes);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      pdf.save('historico-remedios-A4.pdf');
      console.log('PDF em formato A4 exportado com sucesso!');

    } catch (error) {
      console.error('Erro ao renderizar o PDF de remédios em A4:', error);
    } finally {
      document.body.removeChild(relatorioContainer);
    }
  }
}