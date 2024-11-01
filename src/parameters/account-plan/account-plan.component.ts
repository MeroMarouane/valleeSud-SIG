import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account-plan',
  templateUrl: './account-plan.component.html',
  styleUrls: ['./account-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPlanComponent implements OnInit {

  plans = [
    {
      id: 1,
      active: true,
    },
    {
      id: 2,
      active: false
    },
    {
      id: 3,
      active: false
    },
    {
      id: 4,
      active: false
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
