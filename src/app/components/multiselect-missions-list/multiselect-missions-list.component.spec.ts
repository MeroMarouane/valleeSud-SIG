import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectMissionsListComponent } from './multiselect-missions-list.component';

describe('MultiselectMissionsListComponent', () => {
  let component: MultiselectMissionsListComponent;
  let fixture: ComponentFixture<MultiselectMissionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiselectMissionsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiselectMissionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
