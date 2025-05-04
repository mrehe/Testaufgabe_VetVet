import { Component, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-sidebar.component.html',
  styleUrls: ['./ticket-sidebar.component.scss'],
})
export class TicketSidebarComponent implements AfterViewInit {
  @Input() ticket!: Ticket;
  @Output() close = new EventEmitter<void>();
  @Output() statusChanged = new EventEmitter<{ ticketId: string; newStatus: string }>();
  @Output() ticketDeleted = new EventEmitter<string>(); // EventEmitter für das Löschen des Tickets

  statusOptions: string[] = ['Eingegangen', 'In Bearbeitung', 'Nachfrage', 'Fertig'];
  isEditing = true; // Sofort in den Bearbeitungsmodus gehen

  constructor(private ticketService: TicketService) {}

  ngAfterViewInit() {
    console.log('ngAfterViewInit: Sidebar öffnet Ticket', this.ticket); // Initiale Ticket-Details beim ersten Laden
  }

  // Änderungen speichern
  saveChanges() {
    console.log('saveChanges: Änderungen speichern für Ticket', this.ticket);
    if (this.ticket && this.ticket.id) {
      this.ticketService.updateTicketStatus(this.ticket.id, this.ticket.status).subscribe(() => {
        console.log('saveChanges: Ticket gespeichert:', this.ticket);
        this.statusChanged.emit({ ticketId: this.ticket.id, newStatus: this.ticket.status });
        this.isEditing = false; // Bearbeitungsmodus beenden
      });
    }
  }

  // Ticket löschen
  deleteTicket() {
    console.log('deleteTicket: Ticket löschen', this.ticket);
    if (this.ticket && this.ticket.id) {
      this.ticketService.deleteTicket(this.ticket.id).subscribe(() => {
        console.log('deleteTicket: Ticket gelöscht');
        this.ticketDeleted.emit(this.ticket.id); // Ticket-ID an das Dashboard weitergeben
        this.closeSidebar(); // Sidebar nach dem Löschen schließen
      });
    }
  }

  // Sidebar schließen
  closeSidebar() {
    console.log('closeSidebar: Sidebar wird geschlossen');
    this.close.emit();
  }

  isValidDate(date: any): boolean {
    return date && !isNaN(new Date(date).getTime());
  }
}
