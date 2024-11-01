import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersSearchBarComponent } from './admin-users-search-bar.component';

describe('AdminUsersSearchBarComponent', () => {
  let component: AdminUsersSearchBarComponent;
  let fixture: ComponentFixture<AdminUsersSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUsersSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
