import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { EntityAction } from '@ngrx/data';
import { Permission, PermissionsService, Role, RolesService } from 'core';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, combineLatest, map, tap } from 'rxjs';

@Component({
  selector: 'app-roles-management',
  templateUrl: './roles-management.component.html',
  styleUrls: ['./roles-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesManagementComponent implements OnInit, OnDestroy {
  roles$: Observable<Role[]>;
  permissions$: Observable<Permission[]>;

  loading$: Observable<true>;
  errors$: Observable<EntityAction<any>>;

  subscriptions: Subscription[] = [];

  constructor(
    readonly rolesService: RolesService,
    readonly permissionsService: PermissionsService,
    readonly toastr: ToastrService
  ) {
    this.permissions$ = permissionsService.entities$;
    this.errors$ = permissionsService.errors$;
    const sub = this.errors$.subscribe((errors) => {
      this.toastr.error(
        'Une erreur est survenue. Veuillez réessayer plus tard.'
      );
    });
    this.subscriptions.push(sub);
  }

  ngOnInit(): void {
    this.permissionsService.getAll();
    this.rolesService.getAll();
    this.roles$ = combineLatest([
      this.rolesService.entities$,
      this.permissions$,
    ]).pipe(
      tap(([roles, permissions]) => {
        console.log('roles', roles);
        console.log('permissions', permissions);
      }),
      map(([roles, permissions]) => {
        return roles.map((role) => ({
          ...role,
          pemissions: permissions.map((permission) => ({
            ...permission,
            checked: role.pemissions.some((p) => p.id === permission.id),
          })),
        })) as Role[];
      }),
      tap((roles) => console.log('roles', roles))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addRole() {
    this.rolesService.addOneToCache({
      id: 'new_' + new Date().getTime(),
      name: 'Nouveau Role',
      guard_name: 'api',
      pemissions: [],
    });
  }

  deleteRole(id: string) {
    this.rolesService.delete(id);
    this.toastr.success('Role supprimé avec succès');
  }

  saveRole(role: Role) {
    // update role
    if (role.id.toString().includes('new_') === false) {
      this.rolesService.update({
        ...role,
        permissions: role.pemissions
          .filter((p) => p.checked)
          .map((p) => p.id),
      } as any);
      this.toastr.success('Role modifié avec succès');
    } else {
      //add role if not exists
      this.rolesService.removeOneFromCache(role.id);
      delete role.id;
      this.rolesService.add({
        ...role,
        permissions: role.pemissions
          .filter((p) => p.checked)
          .map((p) => p.id),
      } as any);
      this.toastr.success('Role ajouté avec succès');
    }
  }
}
