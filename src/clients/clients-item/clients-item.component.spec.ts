import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsItemComponent } from './clients-item.component';

describe('ClientsItemComponent', () => {
  let component: ClientsItemComponent;
  let fixture: ComponentFixture<ClientsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
