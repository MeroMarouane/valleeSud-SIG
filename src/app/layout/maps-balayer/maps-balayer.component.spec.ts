import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsBalayerComponent } from './maps-balayer.component';

describe('MapsBalayerComponent', () => {
  let component: MapsBalayerComponent;
  let fixture: ComponentFixture<MapsBalayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsBalayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsBalayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
