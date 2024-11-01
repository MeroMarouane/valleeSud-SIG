import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMissionsListComponent } from './home-missions-list.component';

describe('HomeMissionsListComponent', () => {
  let component: HomeMissionsListComponent;
  let fixture: ComponentFixture<HomeMissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeMissionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeMissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
