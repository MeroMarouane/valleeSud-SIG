import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Client, ClientsService } from 'core';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { AddClientModalComponent } from './add-client-modal/add-client-modal.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {
  clients$!: Observable<Client[]>;
  group: string | null = null;
  constructor(
    private dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly clientsService: ClientsService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.clients$ = this.clientsService.entities$.pipe(
      map((clients) => {
        if (!!this.group) {
          return clients.filter((client) => {
            if(typeof client.group === 'number')
              return client.group.toString() === this.group;
            else {
              return client.group?.id.toString() === this.group
            }
          });
        }
        return clients;
      })
    );
    this.route.queryParams.subscribe((qParams) => {
      this.clientsService.clearCache();
      this.group = qParams['group'];
      if (this.group) {
        this.clientsService.getWithQuery({ group: this.group });
      } else {
        this.clientsService.load();
      }
    });
  }

  openAddClientModal(): void {
    this.dialog
      .open(AddClientModalComponent, { data: { group: this.group } })
      .afterClosed()
      .subscribe(() => {
        console.log('add client modal closed');
        this.toastr.success('Client Ajouté avec succes', "Ajout d'un nouveau client")
      });
  }
}
