import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Group } from 'core';
import { Required } from 'shared-ui';

@Component({
  selector: 'app-groups-item',
  templateUrl: './groups-item.component.html',
  styleUrls: ['./groups-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsItemComponent implements OnInit {

  @Input() @Required group!: Group
  iconColor = '#7a7a7a'
  constructor() { }

  ngOnInit(): void {
  }

}
