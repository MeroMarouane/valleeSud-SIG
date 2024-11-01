import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionFilesSwitchComponent } from './mission-files-switch.component';

describe('MissionFilesSwitchComponent', () => {
  let component: MissionFilesSwitchComponent;
  let fixture: ComponentFixture<MissionFilesSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MissionFilesSwitchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionFilesSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
