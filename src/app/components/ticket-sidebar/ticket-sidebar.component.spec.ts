import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketSidebarComponent } from './ticket-sidebar.component';

describe('TicketSidebarComponent', () => {
  let component: TicketSidebarComponent;
  let fixture: ComponentFixture<TicketSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
