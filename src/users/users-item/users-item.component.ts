import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User, UsersService } from 'core';
import { Required } from 'shared-ui';
import { UpdateUserModalComponent } from '../update-user-modal/update-user-modal.component';

@Component({
  selector: 'app-users-item',
  templateUrl: './users-item.component.html',
  styleUrls: ['./users-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersItemComponent implements OnInit {
  @Input() @Required user!: User;

  constructor(
    private readonly usersService: UsersService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit user', this.user);
  }

  deleteUser() {
    this.usersService.delete(this.user);
  }

  editUser() {
    console.log('edit user');
    this.dialog.open(UpdateUserModalComponent, { data: this.user });
  }
}
