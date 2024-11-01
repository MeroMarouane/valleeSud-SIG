import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProjectsListComponent } from './home-projects-list.component';

describe('HomeProjectsListComponent', () => {
  let component: HomeProjectsListComponent;
  let fixture: ComponentFixture<HomeProjectsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeProjectsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
