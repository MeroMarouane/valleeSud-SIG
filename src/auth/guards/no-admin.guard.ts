import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthUser } from '../store/auth.selectors';
import { filter, map } from 'rxjs';
import { PAGES } from 'src/app/config/pages';

@Injectable({
  providedIn: 'root'
})
export class NoAdminGuard implements CanActivate {

  constructor(private store: Store, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(selectAuthUser).pipe(
      filter(user => !!user),
      map(user => {
        if (user.role.some(r => r.name === 'admin')) {
          return this.router.createUrlTree(['/'+PAGES.PLAN]);
        }
        return true;
      })
    )
  }
}
