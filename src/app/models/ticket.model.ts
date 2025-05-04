export interface Ticket {
  id: string;
  tierId: string;
  patient: string;
  betreff: string;
  status: string;
  untersuchungsDatum: Date;
  befund: string;
  behandlungEmpfehlung: string;
  erstelltAm: Date;
}
