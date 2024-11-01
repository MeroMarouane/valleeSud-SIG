import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPlanComponent } from './account-plan.component';

describe('AccountPlanComponent', () => {
  let component: AccountPlanComponent;
  let fixture: ComponentFixture<AccountPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
