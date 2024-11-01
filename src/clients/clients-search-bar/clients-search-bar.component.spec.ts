import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsSearchBarComponent } from './clients-search-bar.component';

describe('ClientsSearchBarComponent', () => {
  let component: ClientsSearchBarComponent;
  let fixture: ComponentFixture<ClientsSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
