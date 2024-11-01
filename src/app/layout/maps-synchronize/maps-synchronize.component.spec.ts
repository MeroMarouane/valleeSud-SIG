import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsSynchronizeComponent } from './maps-synchronize.component';

describe('MapsSynchronizeComponent', () => {
  let component: MapsSynchronizeComponent;
  let fixture: ComponentFixture<MapsSynchronizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsSynchronizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsSynchronizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
