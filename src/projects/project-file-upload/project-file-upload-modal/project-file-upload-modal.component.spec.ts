import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFileUploadModalComponent } from './project-file-upload-modal.component';

describe('ProjectFileDownloadModalComponent', () => {
  let component: ProjectFileUploadModalComponent;
  let fixture: ComponentFixture<ProjectFileUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectFileUploadModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFileUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
