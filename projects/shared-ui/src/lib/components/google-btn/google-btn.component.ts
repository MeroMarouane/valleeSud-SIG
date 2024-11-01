import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Required } from '../../decorators';

@Component({
  selector: 'app-google-btn',
  templateUrl: './google-btn.component.html',
  styleUrls: ['./google-btn.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoogleBtnComponent {
  @Input() @Required text!: string;
}
