import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-create-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ticket-create-modal.component.html',
  styleUrls: ['./ticket-create-modal.component.scss']
})
export class TicketCreateModalComponent {
  @Output() ticketCreated = new EventEmitter<Ticket>();
  @Output() modalClosed = new EventEmitter<void>();

  // Formularfelder
  tierId: string = '';
  patient: string = '';
  betreff: string = '';
  status: string = 'Eingegangen';
  untersuchungsDatum: string = '';
  befund: string = '';
  behandlungEmpfehlung: string = '';

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.closeModal();
  }

  createTicket() {
    if (this.tierId.trim() && this.patient.trim() && this.befund.trim() && this.untersuchungsDatum) {
      const newTicket: Ticket = {
        id: '', // ID wird später vergeben
        betreff: this.betreff,
        patient: this.patient, // Richtiger Patientenname
        tierId: this.tierId,    // Separate Tier-ID
        status: this.status,
        untersuchungsDatum: new Date(this.untersuchungsDatum),
        befund: this.befund,
        behandlungEmpfehlung: this.behandlungEmpfehlung || '',
        erstelltAm: new Date()
      };

      this.ticketCreated.emit(newTicket);
      this.closeModal();
    }
  }

  closeModal() {
    this.modalClosed.emit();
  }
}
