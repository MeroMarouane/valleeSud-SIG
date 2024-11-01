import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Client, ClientsService } from 'core';
import { Required } from 'shared-ui';
import { UpdateClientModalComponent } from '../update-client-modal/update-client-modal.component';

@Component({
  selector: 'app-clients-item',
  templateUrl: './clients-item.component.html',
  styleUrls: ['./clients-item.component.scss']
})
export class ClientsItemComponent implements OnInit {
  @Input() @Required client!: Client;

  constructor(private readonly dialog: MatDialog, private readonly clientsService: ClientsService) { }

  ngOnInit(): void {
    if(!this.client) {
      throw new Error('client must be specified');
    }
  }

  editClient() {
    this.dialog.open(UpdateClientModalComponent, { data: this.client })
  }

  deleteClient() {
    this.clientsService.delete(this.client);
  }

}
