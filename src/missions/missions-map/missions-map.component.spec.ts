import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsMapComponent } from './missions-map.component';

describe('MissionsMapComponent', () => {
  let component: MissionsMapComponent;
  let fixture: ComponentFixture<MissionsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MissionsMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
