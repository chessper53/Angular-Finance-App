import { Injectable } from '@angular/core';
import { TransactionConfirmation } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class FormaterService {

  constructor() { }

  formatManualDate(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  formatAllMonths(fromDate: Date, toDate: Date): string[] {
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
  
  formatMonthName(month: string): string {
    const [year, monthNumber] = month.split('-');
    const monthName = new Date(parseInt(year), parseInt(monthNumber) - 1, 1).toLocaleDateString('en-US', { month: 'long' });
    return monthName;
  }
  
  formatCurrency = (value: number)  =>{
    return new Intl.NumberFormat('de-ch', {
      style: "currency",
      currency: "CHF"
    }).format(value);
  }
}
