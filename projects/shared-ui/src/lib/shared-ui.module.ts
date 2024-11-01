import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components';
import { FileUploadModule } from 'primeng/fileupload';
import { GoogleBtnComponent } from './components/google-btn/google-btn.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    GoogleBtnComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule
  ],
  exports: [
    FileUploadComponent,
    GoogleBtnComponent,
  ]
})
export class SharedUiModule { }
