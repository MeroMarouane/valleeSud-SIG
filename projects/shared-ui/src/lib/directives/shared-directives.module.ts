import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopPropagationDirective } from './stop-propagation/stop-propagation.directive';
import { MarkAsteriskDirective } from './mark-asterisk/mark-asterisk.directive';
import { ComponentHostDirective } from './component-host/component-host.directive';



@NgModule({
  declarations: [
    StopPropagationDirective,
    MarkAsteriskDirective,
    ComponentHostDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StopPropagationDirective,
    MarkAsteriskDirective,
    ComponentHostDirective
  ]
})
export class SharedDirectivesModule { }
