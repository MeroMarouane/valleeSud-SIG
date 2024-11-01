import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

export type ICONS = null | 'arrow_right';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconsComponent implements OnInit {

  @Input() icon: ICONS = null;
  @Input() color = '#2A2E30';

  constructor() { }

  ngOnInit(): void {
  }

}
