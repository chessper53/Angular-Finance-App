import { Component , Input, OnInit} from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { AccountBalance } from 'src/app/services/account.service';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { DateQuery, TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-expenditures',
  templateUrl: './expenditures.component.html',
  styleUrls: ['./expenditures.component.scss']
})
export class ExpendituresComponent implements OnInit{
  constructor(public transactionService:TransactionService, public localsave:LocalsaveService){}
  @Input() currentAccount!: AccountBalance
  
  pieChartData!: any[];
  token!: string
  transactions!: TransactionConfirmation[]
  transaction = new Subject<TransactionQuery>
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#109618', '#FF9900', '#990099', '#0099C6'],
  } as any;
  

  dateQuery: DateQuery = {
    fromDate: null!,
    toDate: null! 
  };
  
  ngOnInit(): void {
    this.token = this.localsave.load();
    const currentDate = new Date();
    this.dateQuery.fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.dateQuery.toDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.fetchTransactions();
  }

  handleDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate: Date = event.value!;
    this.dateQuery.fromDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    this.dateQuery.toDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    this.fetchTransactions();
  }

  formatManualDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  fetchTransactions(): void {
    this.transactionService.getTransactions(this.token, this.dateQuery).subscribe(
      (a: TransactionQuery) => {
        this.transaction.next(a);
        this.transactions = a?.result || [];
        this.pieChartData = [];
        const categoryCount: { [key: string]: number } = {};
        this.transactions.forEach(transaction => {
          const category = transaction.category || 'Uncategorized';
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
    
        Object.keys(categoryCount).forEach(category => {
          this.pieChartData.push({
            name: category,
            value: categoryCount[category]
          });
        });
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
  
}