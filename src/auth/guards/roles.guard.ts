import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthFacade } from '../store/auth.facade';
import { map } from 'rxjs';

export const RolesGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.user$.pipe(
    map((user) => {
      //Check if user have the required role
      const roles = route.firstChild?.data?.roles;
      if (
        roles?.some((role) => user.role.some((r) => r.name === role) === false)
      ) {
        router.navigate(['/']);
        return false;
      }

      return true;
    })
  );
};
