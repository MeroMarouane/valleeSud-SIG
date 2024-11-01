import { TestBed } from '@angular/core/testing';

import { MissionFileUploadService } from './mission-file-upload.service';

describe('MissionFileUploadService', () => {
  let service: MissionFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
