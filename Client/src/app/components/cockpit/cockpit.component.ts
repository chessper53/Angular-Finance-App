import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AccountBalance, AccountService } from 'src/app/services/account.service';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-cockpit',
  templateUrl: './cockpit.component.html',
  styleUrls: ['./cockpit.component.scss']
})
export class CockpitComponent implements OnInit{
  constructor( private router: Router, public localsave:LocalsaveService, public accountservice: AccountService, public transactionService:TransactionService){}
  selectedDate: Date | null = null;
  currentAccount!: AccountBalance
  transactions!: TransactionConfirmation[]
  transaction = new Subject<TransactionQuery>
  token!: string

  ngOnInit(): void {
    this.token = this.localsave.load();
    this.accountservice.getCurrentBalance(this.token).subscribe({
      next: currAcc => {
        this.currentAccount = currAcc;
      }
    })
    this.transactionService.getTransactions(this.token).subscribe({
      next: a => {
        this.transaction.next(a);
      }
    })
    this.transaction.subscribe(a => {
      this.transactions = a.result;
    });

  }
}
