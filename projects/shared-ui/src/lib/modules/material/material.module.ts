import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';

const modules = [
  CommonModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule
]
@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class MaterialModule { }
