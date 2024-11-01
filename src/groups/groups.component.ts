import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Group, GroupsService } from 'core';
import { Observable } from 'rxjs';
import { AddGroupModalComponent } from './add-group-modal/add-group-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {
  groups$!: Observable<Group[]>;
  constructor(
    private readonly dialog: MatDialog,
    private readonly groupsService: GroupsService,
    private readonly toastr: ToastrService
  ) {
    this.toastr.toastrConfig.preventDuplicates = true;
  }

  ngOnInit(): void {
    this.groups$ = this.groupsService.entities$;
    this.groupsService.clearCache();
    this.groupsService.getAll();

    this.groupsService.errors$.subscribe((error) => {
      console.log(error);
      this.toastr.error('Une erreur est survenue', 'Erreur');
    })
  }

  openAddGroupModal() {
    this.dialog
      .open(AddGroupModalComponent)
      .afterClosed()
      .subscribe((val) => console.log('modal closed', val));
  }
}
