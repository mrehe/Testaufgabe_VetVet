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
    // Wenn es gespeicherte Tickets gibt, lade sie
    const savedTickets = localStorage.getItem('tickets');
    if (savedTickets) {
      this.tickets = JSON.parse(savedTickets);
    }
  }

  // Alle Tickets abrufen
  getTickets(): Observable<Ticket[]> {
    return of(this.tickets);
  }

  // Neues Ticket hinzufügen
  addTicket(ticket: Ticket): Observable<Ticket> {
    ticket.id = 'T-' + (this.tickets.length + 1).toString().padStart(3, '0'); // ID generieren
    ticket.erstelltAm = new Date(); // Erstellungsdatum setzen

    this.tickets.push(ticket); // Füge Ticket hinzu
    this.saveToLocalStorage(); // Speichere alle Tickets in localStorage
    this.ticketChanged.emit(); // Benachrichtige alle Komponenten
    return of(ticket); // Rückgabe des hinzugefügten Tickets
  }

  // Status eines bestehenden Tickets aktualisieren
  updateTicketStatus(ticketId: string, newStatus: string): Observable<Ticket | null> {
    const ticket = this.tickets.find(t => t.id === ticketId);
    if (ticket) {
      ticket.status = newStatus; // Status ändern
      this.saveToLocalStorage(); // Speichern der geänderten Liste
      this.ticketChanged.emit(); // Event auslösen
      return of(ticket); // Rückgabe des geänderten Tickets
    } else {
      console.warn(`[TicketService] updateTicketStatus: Ticket mit ID ${ticketId} nicht gefunden.`);
      return of(null); // Wenn Ticket nicht gefunden wird, null zurückgeben
    }
  }

  // Ein Ticket löschen
  deleteTicket(ticketId: string): Observable<string | null> {
    const ticketIndex = this.tickets.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex !== -1) {
      this.tickets.splice(ticketIndex, 1); // Ticket aus dem Array entfernen
      this.saveToLocalStorage(); // Änderungen speichern
      this.ticketChanged.emit(); // Event auslösen
      return of(ticketId); // Rückgabe der ID des gelöschten Tickets
    } else {
      console.warn(`[TicketService] deleteTicket: Ticket mit ID ${ticketId} nicht gefunden.`);
      return of(null); // Wenn Ticket nicht gefunden wird, null zurückgeben
    }
  }

  // Tickets im localStorage speichern
  private saveToLocalStorage() {
    try {
      localStorage.setItem('tickets', JSON.stringify(this.tickets)); // Alle Tickets als JSON speichern
      console.log("Tickets wurden im LocalStorage gespeichert", this.tickets);
    } catch (e) {
      console.error('Fehler beim Speichern der Tickets im LocalStorage', e);
    }
  }
}
