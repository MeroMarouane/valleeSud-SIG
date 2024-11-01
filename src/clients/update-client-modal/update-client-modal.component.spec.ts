import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateClientModalComponent } from './update-client-modal.component';

describe('UpdateClientModalComponent', () => {
  let component: UpdateClientModalComponent;
  let fixture: ComponentFixture<UpdateClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateClientModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
