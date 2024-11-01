import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { Observable, map } from 'rxjs';
import { PrimeNgModules } from 'shared-ui';
import { MENU_ITEMS } from 'src/app/config/menu-items';
import { PAGES } from 'src/app/config/pages';
import { AuthFacade } from 'src/auth/store/auth.facade';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, PrimeNgModules],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  showUserMenu = false;
  menuItems$: Observable<MegaMenuItem[]>;

  constructor(public readonly authFacade: AuthFacade) {}

  ngOnInit(): void {
    this.menuItems$ = this.authFacade.user$.pipe(
      map((user) => {
        const isAdmin = user?.role?.some((r) => r.name === 'admin');
        let menuItems = [];
        Object.values(MENU_ITEMS).forEach((m) => {
          // exclude groups and clients from menu if the user is not an admin
          if (!isAdmin && [PAGES.GROUPES, PAGES.CLIENTS].includes(m.routerLink))
            return;

          // exclude dashboard and users from menu if the user is an admin
          if (isAdmin && [PAGES.DASHBOARD, PAGES.USERS, PAGES.DOCUMENTATION].includes(m.routerLink)) return;

          const menuItem = {
            ...m,
            routerLink: m.routerLink ? `/${m.routerLink}` : m.routerLink,
          };

          menuItems.push(menuItem);
        });
        return menuItems;
      })
    );
  }

  toggleUserMenu(userMenuEl?: HTMLDivElement) {
    this.showUserMenu = !this.showUserMenu;

    if (this.showUserMenu) {
      if (userMenuEl.classList.contains('user-menu-close'))
        userMenuEl.classList.replace('user-menu-close', 'user-menu-open');
      else userMenuEl.classList.add('user-menu-open');
    } else {
      userMenuEl.classList.replace('user-menu-open', 'user-menu-close');
    }
  }

  logout() {
    this.authFacade.logout();
  }
}
