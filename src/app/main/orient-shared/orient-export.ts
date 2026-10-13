import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export function exportTablePdf(title: string, headers: string[], rows: string[][]): void {
  const doc = new jsPDF('l', 'pt');
  doc.setFontSize(12);
  doc.text(title, 40, 28);
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 44,
    styles: { fontSize: 8, overflow: 'linebreak' },
    headStyles: { fillColor: [3, 155, 229] }
  });
  doc.save(fileName(title) + '.pdf');
}

export function exportTableExcel(title: string, headers: string[], rows: string[][]): void {
  const sheet = XLSX.utils.aoa_to_sheet([headers].concat(rows));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Donnees');
  XLSX.writeFile(book, fileName(title) + '.xlsx');
}

function fileName(title: string): string {
  return (title || 'export').replace(/[\\/:*?"<>|]/g, '-');
}

export function readTableFile(file: File, done: (headers: string[], rows: string[][]) => void): void {
  const reader = new FileReader();
  reader.onload = function () {
    const book = XLSX.read(reader.result, { type: 'array' });
    const sheet = book.Sheets[book.SheetNames[0]];
    const grid = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    if (!grid || !grid.length) {
      done([], []);
      return;
    }
    const headers = (grid[0] || []).map(function (cell) { return String(cell == null ? '' : cell).trim(); });
    const rows: string[][] = [];
    let i: number;
    for (i = 1; i < grid.length; i++) {
      const line = grid[i] || [];
      if (!line.length) {
        continue;
      }
      rows.push(line.map(function (cell) { return cell == null ? '' : String(cell); }));
    }
    done(headers, rows);
  };
  reader.readAsArrayBuffer(file);
}
