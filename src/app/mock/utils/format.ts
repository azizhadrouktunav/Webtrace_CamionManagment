const nf = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export function fmtNum(n: number): string {
  return nf.format(n);
}

export function fmtInt(n: number): string {
  return nf0.format(n);
}

export function fmtMin(n: number): string {
  return `${nf.format(n)} min`;
}

export function fmtSignedMin(n: number): string {
  const rounded = Math.round(n * 10) / 10;
  if (rounded === 0) return '0 min';
  return `${rounded > 0 ? '+' : '−'}${nf.format(Math.abs(rounded))} min`;
}

export function fmtAgo(sec: number): string {
  if (sec < 60) return `${sec} s`;
  if (sec < 3600) return `${Math.floor(sec / 60)} min`;
  return `${Math.floor(sec / 3600)} h`;
}

/** Frontend-style age for horodatage pills (e.g. "< 1 mn", "5 mn", "2 h") */
export function fmtAge(sec: number): string {
  if (sec < 60) return '< 1 mn';
  if (sec < 3600) return `${Math.floor(sec / 60)} mn`;
  if (sec < 86400) return `${Math.floor(sec / 3600)} h`;
  const days = Math.floor(sec / 86400);
  if (days < 30) return `${days} j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mois`;
  return `${Math.floor(months / 12)} ans`;
}

export function fmtClock(d: Date): string {
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function fmtTrips(done: number, target: number): string {
  return target ? `${done}/${target}` : `${done} voy.`;
}

export function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}