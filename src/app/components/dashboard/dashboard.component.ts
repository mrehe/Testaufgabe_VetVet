import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Ticket } from '../../models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { TicketCreateModalComponent } from '../ticket-create-modal/ticket-create-modal.component';
import { TicketSidebarComponent } from '../ticket-sidebar/ticket-sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TicketCardComponent,
    TicketCreateModalComponent,
    TicketSidebarComponent,
    NgxChartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  modalVisible = false;
  selectedTicket: Ticket | null = null;
  statusSpalten = ['Eingegangen', 'In Bearbeitung', 'Nachfrage', 'Fertig'];

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  filterStatus: string | null = null;

  ticketChartData = [
    { name: 'Eingegangen', value: 0 },
    { name: 'In Bearbeitung', value: 0 },
    { name: 'Nachfrage', value: 0 },
    { name: 'Fertig', value: 0 }
  ];

  view: [number, number] = [700, 400];
  colorScheme = 'cool'; // Farbpalette für Charts

  constructor(private ticketService: TicketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Dashboard Component Initialized');
    this.loadTickets();
  }

  private loadTickets() {
    console.log('Loading Tickets...');
    this.ticketService.getTickets().subscribe(tickets => {
      console.log('Tickets geladen:', tickets);
      this.tickets = tickets;
      this.applyFilter(); // Filter anwenden, falls ein Filter gesetzt ist
      this.updateChartData(); // Diagrammdaten aktualisieren
    }, error => {
      console.error('Fehler beim Laden der Tickets:', error);
    });
  }

  get totalTickets(): number {
    console.log('Gesamtzahl der Tickets:', this.filteredTickets.length);
    return this.filteredTickets.length;
  }

  getTicketsByStatus(status: string): Ticket[] {
    console.log(`Tickets mit Status ${status}:`, this.filteredTickets.filter(ticket => ticket.status === status));
    return this.filteredTickets.filter(ticket => ticket.status === status);
  }

  openModal() {
    console.log('Modal öffnen');
    this.modalVisible = true;
  }

  closeModal() {
    console.log('Modal schließen');
    this.modalVisible = false;
  }

  createNewTicket(ticket: Ticket) {
    console.log('Neues Ticket erstellen:', ticket);
    this.ticketService.addTicket(ticket).subscribe(() => {
      console.log('Ticket erstellt');
      this.loadTickets(); // Tickets nach dem Erstellen neu laden
      this.closeModal(); // Modal schließen
    }, error => {
      console.error('Fehler beim Erstellen des Tickets:', error);
    });
  }

  openSidebar(ticket: Ticket) {
    console.log('Sidebar öffnet Ticket:', ticket); // Debug Log
    this.selectedTicket = ticket;
  }

  closeSidebar() {
    console.log('Sidebar schließen');
    this.selectedTicket = null;
  }

  onStatusChanged(event: { ticketId: string; newStatus: string }) {
    console.log('Status geändert:', event);
    this.ticketService.updateTicketStatus(event.ticketId, event.newStatus).subscribe(() => {
      console.log('Status geändert und Tickets neu laden');
      this.loadTickets(); // Tickets neu laden nach Statusänderung
      this.selectedTicket = null; // Sidebar schließen
    }, error => {
      console.error('Fehler beim Ändern des Status:', error);
    });
  }

  filterTicketsByStatus(status: string) {
    console.log(`Tickets filtern nach Status: ${status}`);
    this.filterStatus = status;
    this.applyFilter(); // Filter anwenden
  }

  clearFilter() {
    console.log('Filter zurücksetzen');
    this.filterStatus = null;
    this.applyFilter(); // Alle Tickets anzeigen
  }

  private applyFilter() {
    console.log('Anwenden des Filters...');
    if (this.filterStatus) {
      console.log(`Filter angewendet für Status: ${this.filterStatus}`);
      this.filteredTickets = this.tickets.filter(ticket => ticket.status === this.filterStatus);
    } else {
      console.log('Kein Filter gesetzt, alle Tickets anzeigen');
      this.filteredTickets = [...this.tickets];
    }
    this.updateChartData(); // Diagrammdaten nach Filteranwendung aktualisieren
  }

  private updateChartData() {
    console.log('Aktualisiere Diagrammdaten...');
    const statusCounts: { [key: string]: number } = {
      'Eingegangen': 0,
      'In Bearbeitung': 0,
      'Nachfrage': 0,
      'Fertig': 0
    };

    this.filteredTickets.forEach(ticket => {
      if (this.isValidStatus(ticket.status)) {
        console.log(`Ticket mit Status ${ticket.status} gefunden.`);
        statusCounts[ticket.status]++;
      }
    });

    this.ticketChartData = [
      { name: 'Eingegangen', value: statusCounts['Eingegangen'] },
      { name: 'In Bearbeitung', value: statusCounts['In Bearbeitung'] },
      { name: 'Nachfrage', value: statusCounts['Nachfrage'] },
      { name: 'Fertig', value: statusCounts['Fertig'] }
    ];
    console.log('Aktualisierte Diagrammdaten:', this.ticketChartData);
  }

  private isValidStatus(status: string): status is 'Eingegangen' | 'In Bearbeitung' | 'Nachfrage' | 'Fertig' {
    console.log('Überprüfe Status:', status);
    return this.statusSpalten.includes(status);
  }

  // Methode zum Entfernen eines Tickets nach Löschung
  onTicketDeleted(ticketId: string) {
    console.log(`Lösche Ticket mit ID: ${ticketId}`);
    // Ticket sofort aus der Liste entfernen
    this.tickets = this.tickets.filter(ticket => ticket.id !== ticketId);
    this.filteredTickets = this.filteredTickets.filter(ticket => ticket.id !== ticketId);

    // Benachrichtige Angular, dass Änderungen vorgenommen wurden
    this.cdr.detectChanges();
    console.log('Tickets nach Löschen:', this.tickets);

    // Diagrammdaten nach dem Löschen aktualisieren
    this.updateChartData();
  }
}
  	