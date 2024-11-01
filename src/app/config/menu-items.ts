import { MegaMenuItem } from 'primeng/api';
import { PAGES } from './pages';

export const MENU_ITEMS: Record<string, MegaMenuItem> = {
  [PAGES.DASHBOARD]: {
    label: 'Accueil',
    routerLink: PAGES.DASHBOARD,
  },
  [PAGES.PLAN]: {
    label: 'Plan',
    routerLink: PAGES.PLAN,
  },
  [PAGES.SITES]: {
    routerLink: PAGES.SITES,
    label: 'Sites',
  },
  [PAGES.USERS]: {
    routerLink: PAGES.USERS,
    label: 'Utilisateurs',
  },
  [PAGES.CLIENTS]: {
    routerLink: PAGES.CLIENTS,
    label: 'Clients',
  },
  [PAGES.GROUPES]: {
    routerLink: PAGES.GROUPES,
    label: 'Groupes',
  },
  [PAGES.DOCUMENTATION]: {
    routerLink: PAGES.DOCUMENTATION,
    label: 'Documentation',
  },
  [PAGES.PARAMETERS]: {
    routerLink: PAGES.PARAMETERS,
    label: 'Paramètres',
  },
};
