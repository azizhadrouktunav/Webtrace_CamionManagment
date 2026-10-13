import { Driver } from 'app/mock/types/fleet';
import { Tone } from 'app/mock/utils/status';

/** Maps status tone to CSS chip modifier class. */
export function chipClass(tone: Tone, withDot?: boolean): string {
  const base = 'orient-chip orient-chip--' + tone;
  return withDot ? base + ' orient-chip--dot' : base;
}

/** Display name for a driver (Prénom Nom). */
export function driverDisplayName(d: Driver | null | undefined): string {
  if (!d) {
    return '—';
  }
  const parts = [(d.firstName || '').trim(), (d.lastName || '').trim()].filter(Boolean);
  return parts.length ? parts.join(' ') : d.id;
}
