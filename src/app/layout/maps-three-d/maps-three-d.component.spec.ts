import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsThreeDComponent } from './maps-three-d.component';

describe('MapsThreeDComponent', () => {
  let component: MapsThreeDComponent;
  let fixture: ComponentFixture<MapsThreeDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsThreeDComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsThreeDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
