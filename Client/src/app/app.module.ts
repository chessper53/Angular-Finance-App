import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormControl, FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSortModule } from '@angular/material/sort';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RegisterComponent } from './components/register/register.component';
import { LastTransactionsComponent } from './components/last-transactions/last-transactions.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CockpitComponent } from './components/cockpit/cockpit.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExpendituresComponent } from './components/expenditures/expenditures.component';
import { BudgetplanComponent } from './components/budgetplan/budgetplan.component';
import { LinechartComponent } from './components/linechart/linechart.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    RegisterComponent,
    LastTransactionsComponent,
    CockpitComponent,
    ExpendituresComponent,
    BudgetplanComponent,
    LinechartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatNativeDateModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
