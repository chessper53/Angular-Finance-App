import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'; 
import { TransactionService, TransactionQuery, TransactionConfirmation, DateQuery } from 'src/app/services/transaction.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormaterService } from 'src/app/services/formater.service';

@Component({
  selector: 'app-last-transactions',
  templateUrl: './last-transactions.component.html',
  styleUrls: ['./last-transactions.component.scss']
})
export class LastTransactionsComponent implements OnInit{
  constructor(public transactionService:TransactionService, public localsave:LocalsaveService, public formaterService:FormaterService){}
  @Input() cockpit: boolean = false;
  displayedColumns: string[] = ['from', 'target', 'amount', 'total', 'date']
  token!: string
  accountnumber!: string
  dataSource!: MatTableDataSource<TransactionConfirmation>  
  selectedDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.token = this.localsave.load();
    this.fetchTransactions();
  }

  dateQuery: DateQuery = {
    fromDate: null!,
    toDate: null! 
  };
  
  fetchTransactions(): void {
    this.transactionService.getTransactions(this.token, this.dateQuery)
    .subscribe(
      (transactions: TransactionQuery) => {
        this.dataSource = new MatTableDataSource<TransactionConfirmation>(transactions.result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error getting transactions:', error);
      }
    );
  }

  handleDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate: Date = event.value!;
    this.dateQuery.fromDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    this.dateQuery.toDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    this.fetchTransactions();
  }
}
