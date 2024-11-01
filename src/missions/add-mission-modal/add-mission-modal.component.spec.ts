import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMissionModalComponent } from './add-mission-modal.component';

describe('AddMissionModalComponent', () => {
  let component: AddMissionModalComponent;
  let fixture: ComponentFixture<AddMissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMissionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
