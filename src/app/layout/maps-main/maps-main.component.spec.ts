import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsMainComponent } from './maps-main.component';

describe('MapsMainComponent', () => {
  let component: MapsMainComponent;
  let fixture: ComponentFixture<MapsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
