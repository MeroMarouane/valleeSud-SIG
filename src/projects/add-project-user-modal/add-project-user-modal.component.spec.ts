import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectUserModalComponent } from './add-project-user-modal.component';

describe('AddProjectUserComponent', () => {
  let component: AddProjectUserModalComponent;
  let fixture: ComponentFixture<AddProjectUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProjectUserModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProjectUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
