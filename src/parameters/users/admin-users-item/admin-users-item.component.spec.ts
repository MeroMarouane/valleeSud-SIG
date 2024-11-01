import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUsersItemComponent } from './admin-users-item.component';

describe('AdminUsersItemComponent', () => {
  let component: AdminUsersItemComponent;
  let fixture: ComponentFixture<AdminUsersItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminUsersItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUsersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
