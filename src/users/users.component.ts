import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { User, UsersService } from 'core';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthState } from 'src/auth/store/auth.models';
import { selectAuthUser } from 'src/auth/store/auth.selectors';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit {
  users$!: Observable<User[]>;
  clientId: number | null = null;

  user = this.store.select(selectAuthUser);

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
    private readonly usersService: UsersService,
    private readonly store: Store<AuthState>
  ) {}

  ngOnInit(): void {
    this.users$ = this.usersService.entities$;
    this.route.params
      .pipe(
        switchMap((params) => {
          if (params['clientId']) {
            this.clientId = +params['clientId'];
            return of(this.clientId)
          }
          return this.user.pipe(map(user => {
            if(typeof user?.client === 'number')
              return user.client;
            return user?.client?.id;
          }));
        })
      )
      .subscribe(clientId => {
        // this.usersService.getWithQuery({ client: clientId.toString() })
        this.usersService.getAll();
      });
  }

  openAddUserModal(): void {
    this.dialog
      .open(AddUserModalComponent, { data: this.clientId })
      .afterClosed()
      .subscribe(() => console.log('add user modal closed'));
  }
}
