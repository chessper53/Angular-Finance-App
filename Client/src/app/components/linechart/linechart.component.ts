import { Component , Input} from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DateQuery, TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';
import { AccountBalance } from 'src/app/services/account.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormaterService } from 'src/app/services/formater.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss'],
})

export class LinechartComponent {
  constructor(public transactionService:TransactionService, public localsave:LocalsaveService, public formaterService:FormaterService){}

  @Input() transactionData!: TransactionConfirmation[]
  @Input() currentAccount!: AccountBalance
 
  colorScheme = {
    domain: ['#5AA454', '#E44D25'],
  } as any;
 
  chartData!: any[];
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Date';
  yAxisLabel = 'Balance';
  token!: string
  transactions!: TransactionConfirmation[]
  transaction = new Subject<TransactionQuery>


  handleDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate: Date = event.value!;
    this.dateQuery.fromDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    this.dateQuery.toDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    this.fetchTransactions();
  }

  fetchTransactions(): void {
    this.transactionService.getTransactions(this.token, this.dateQuery).subscribe({
      next: a => {
        this.transaction.next(a);
        this.transactions = a?.result || [];
        
        if (this.currentAccount && this.transactionData) {
          const incomingData = this.transactions.filter((transaction) => transaction.from !== this.currentAccount.accountNr);  
          const outgoingData = this.transactions.filter((transaction) => transaction.from === this.currentAccount.accountNr);

          this.chartData = [
            {
              name: 'Expenses',
              series: outgoingData.map((transaction) => ({
                name: this.formaterService.formatManualDate(transaction.date),
                value: transaction.amount * (-1),
              })),
            },
            {
              name: 'Profit',
              series: incomingData.map((transaction) => ({
                name: this.formaterService.formatManualDate(transaction.date),
                value: transaction.amount,
              })),
            },
          ];
        }
      },
      error: error => {
        console.error('Error fetching transactions:', error);
      }
    });
  }

  dateQuery: DateQuery = {
    fromDate: null!,
    toDate: null! 
  };
  
  ngOnInit() {
    this.token = this.localsave.load();
    const currentDate = new Date();
    this.dateQuery.fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() -1 , 1);
    this.dateQuery.toDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    this.fetchTransactions();
  }  
}
