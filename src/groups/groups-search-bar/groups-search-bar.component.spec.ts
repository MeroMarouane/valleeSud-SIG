import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsSearchBarComponent } from './groups-search-bar.component';

describe('GroupsSearchBarComponent', () => {
  let component: GroupsSearchBarComponent;
  let fixture: ComponentFixture<GroupsSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupsSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
