import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFileUploadComponent } from './project-file-upload.component';

describe('ProjectFileDownloadComponent', () => {
  let component: ProjectFileUploadComponent;
  let fixture: ComponentFixture<ProjectFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectFileUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
