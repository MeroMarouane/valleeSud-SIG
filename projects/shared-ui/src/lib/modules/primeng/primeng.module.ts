import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { AccordionModule } from 'primeng/accordion';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { SliderModule } from 'primeng/slider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';

const modules = [
  ButtonModule,
  InputTextModule,
  CheckboxModule,
  MenubarModule,
  MegaMenuModule,
  DividerModule,
  PanelModule,
  InputTextareaModule,
  FileUploadModule,
  AccordionModule,
  ListboxModule,
  DropdownModule,
  CalendarModule,
  AutoCompleteModule,
  MenuModule,
  RippleModule,
  SliderModule,
  SelectButtonModule,
  TableModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class PrimeNgModules {}
