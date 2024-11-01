import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthFacade } from 'src/auth/store/auth.facade';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.component.html',
  styleUrls: ['./parameters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParametersComponent {

  isAdmin$ = this.authFacade.user$.pipe(map((user) => user?.role?.some((r) => r.name === 'admin')));

  constructor(private readonly authFacade: AuthFacade) { }

}
