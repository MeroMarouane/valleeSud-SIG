import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-users-item',
  templateUrl: './admin-users-item.component.html',
  styleUrls: ['./admin-users-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
