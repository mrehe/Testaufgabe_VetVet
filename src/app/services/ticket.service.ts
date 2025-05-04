import { Injectable, EventEmitter } from '@angular/core';
import { Ticket } from '../models/ticket.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private tickets: Ticket[] = []; // Lokales Array für Tickets
  ticketChanged = new EventEmitter<void>(); // Emit event, wenn Tickets geändert werden

  constructor() {
    // Wenn es im localStorage gespeicherte Tickets gibt, lade sie
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      this.tickets = JSON.parse(savedTickets); // Aus localStorage laden
    }
  }

  // Alle Tickets abrufen
  getTickets(): Observable<Ticket[]> {
    return of(this.tickets); // Gibt die Tickets als Observable zurück
  }

  // Ein neues Ticket hinzufügen
  addTicket(ticket: Ticket): Observable<Ticket> {
    ticket.id = 'T-' + (this.tickets.length + 1).toString().padStart(3, '0'); // ID generieren
    ticket.erstelltAm = new Date(); // Erstellungsdatum setzen

    this.tickets.push(ticket); // Ticket zum lokalen Array hinzufügen
    this.saveToLocalStorage(); // Speichere die Tickets im localStorage
    this.ticketChanged.emit(); // Emit event für Änderungen
    return of(ticket); // Gibt das neue Ticket als Observable zurück
  }

  // Status eines Tickets aktualisieren
  updateTicketStatus(ticketId: string, newStatus: string): Observable<void> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = newStatus;
      this.saveToLocalStorage(); // Änderungen im localStorage speichern
      this.ticketChanged.emit(); // Emit event für Änderungen
    }
    return of(); // Gibt ein leeres Observable zurück
  }

  // Ticket löschen
  deleteTicket(ticketId: string): Observable<void> {
    this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
    this.saveToLocalStorage();
    this.ticketChanged.emit(); // Emit event für Änderungen
    return of(); // Gibt ein leeres Observable zurück
  }

  // Tickets im localStorage speichern
  private saveToLocalStorage() {
    localStorage.setItem('tickets', JSON.stringify(this.tickets)); // Tickets im localStorage speichern
  }
}
