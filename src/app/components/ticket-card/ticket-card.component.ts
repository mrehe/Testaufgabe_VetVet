// src/app/components/ticket-card/ticket-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';  // CommonModule importieren
import { Ticket } from '../../models/ticket.model';


@Component({
  selector: 'app-ticket-card',
  standalone: true,  // Falls du Standalone-Komponenten verwendest
  imports: [CommonModule],  // Das CommonModule importieren, um die date-Pipe zu verwenden
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.scss']
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;  // @Input für die Ticket-Eigenschaft
}
