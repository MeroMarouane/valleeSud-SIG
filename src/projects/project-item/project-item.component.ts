import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Site } from 'core';
import { Required } from 'shared-ui';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectItemComponent implements OnInit {
  @Input() @Required site!: Site;

  @Input() linkDisabled: boolean | null = null;

  statusBgColor: Record<string, string> = {
    Complete: '#C8C8C8',
    Pending: '#7450E9',
    Cancelled: '#E95050',
  };

  constructor() {}

  ngOnInit(): void {}
}
