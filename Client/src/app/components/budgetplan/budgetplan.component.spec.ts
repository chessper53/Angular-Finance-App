import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetplanComponent } from './budgetplan.component';

describe('BudgetplanComponent', () => {
  let component: BudgetplanComponent;
  let fixture: ComponentFixture<BudgetplanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BudgetplanComponent]
    });
    fixture = TestBed.createComponent(BudgetplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
