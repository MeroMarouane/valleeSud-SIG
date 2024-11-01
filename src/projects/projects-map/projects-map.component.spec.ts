import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsMapComponent } from './projects-map.component';

describe('ProjectsMapComponent', () => {
  let component: ProjectsMapComponent;
  let fixture: ComponentFixture<ProjectsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectsMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
