import { Component , Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { AccountBalance } from 'src/app/services/account.service';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { DateQuery, TransactionConfirmation, TransactionQuery, TransactionService } from 'src/app/services/transaction.service';


@Component({
  selector: 'app-budgetplan',
  templateUrl: './budgetplan.component.html',
  styleUrls: ['./budgetplan.component.scss']
})
export class BudgetplanComponent implements OnInit{
  constructor(public transactionService:TransactionService, public localsave:LocalsaveService){ }
  @Input() currentAccount!: AccountBalance

  BudgetChartData!: any[];
  token!: string
  transactions!: TransactionConfirmation[]
  transaction = new Subject<TransactionQuery>

  colorScheme = {
    domain: ['#5AA454', '#E44D25'],
  } as any;



  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Months';
  yAxisLabel: string = 'Balance';
  legendTitle: string = 'Legend';

  dateQuery: DateQuery = {
    fromDate: null!,
    toDate: null! 
  };
  
  ngOnInit(): void {
    this.token = this.localsave.load();
    const currentDate = new Date();
    this.dateQuery.fromDate = new Date(currentDate.getFullYear() -1, currentDate.getMonth(), 1);
    this.dateQuery.toDate = new Date(currentDate.getFullYear(),currentDate.getMonth(), 0);
    this.fetchTransactions();
  }

  handleDateChange(event: MatDatepickerInputEvent<Date>): void {
    const selectedDate: Date = event.value!;
    this.dateQuery.fromDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    this.dateQuery.toDate = new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), 0);
    this.fetchTransactions();
  }

  formatManualDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  fetchTransactions(): void {
    this.transactionService.getTransactions(this.token, this.dateQuery).subscribe(
      (a: TransactionQuery) => {
        this.transaction.next(a);
        this.transactions = a?.result || [];
  
        const allMonths = this.getAllMonths(this.dateQuery.fromDate, this.dateQuery.toDate);
        const dataByMonth = this.organizeDataByMonth(this.transactions);
  
        this.BudgetChartData = allMonths.map((month) => ({
          name: month,
          series: [
            {
              name: 'Profit',
              value: dataByMonth[month]?.incoming || 0,
            },
            {
              name: 'Expenses',
              value: (dataByMonth[month]?.outgoing || 0) * (-1),
            },
          ],
        }));
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
  
  
  
  getAllMonths(fromDate: Date, toDate: Date): string[] {
    const allMonths: string[] = [];
    let currentDate = new Date(fromDate);
  
    while (currentDate <= toDate) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      allMonths.push(`${year}-${month}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    return allMonths;
  }
  
  organizeDataByMonth(transactions: TransactionConfirmation[]): { [month: string]: { incoming: number; outgoing: number } } {
    const dataByMonth: { [month: string]: { incoming: number; outgoing: number } } = {};
  
    transactions.forEach((transaction) => {
      const yearMonth = this.formatManualDate(transaction.date).substring(0, 7);
  
      if (!dataByMonth[yearMonth]) {
        dataByMonth[yearMonth] = { incoming: 0, outgoing: 0 };
      }
      
      if (transaction.from !== this.currentAccount.accountNr) {
        dataByMonth[yearMonth].incoming += transaction.amount;
      } else {
        dataByMonth[yearMonth].outgoing += transaction.amount;
      }
    });
    return dataByMonth;
  }
}
