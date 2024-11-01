import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMissionModalComponent } from './update-mission-modal.component';

describe('UpdateMissionModalComponent', () => {
  let component: UpdateMissionModalComponent;
  let fixture: ComponentFixture<UpdateMissionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateMissionModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateMissionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
