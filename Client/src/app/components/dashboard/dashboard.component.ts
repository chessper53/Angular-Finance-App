import { Component, OnInit, HostListener  } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { AccountBalance, AccountService } from 'src/app/services/account.service';
import { Transaction, TransactionService, TransactionConfirmation } from 'src/app/services/transaction.service';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule  } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],animations: [
    trigger('fadeInSlideUp', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(10px)',
      })),
      transition(':enter', [
        animate('300ms ease-out')
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit{
  constructor( private router: Router, public localsave:LocalsaveService, public accountservice: AccountService, public transactionService:TransactionService, private fb: FormBuilder){}

  TransactionForm!: FormGroup 
  token!: string
  ownerId?: string
  accountNr?: string
  amount!: number
  firstname?: string
  lastname?: string
  login?: string
  errorMessage!: string



  
  getPersonalAccountInfo(): void{
    this.accountservice.getCurrentBalance(this.token).
      subscribe({
        next: a =>{
          this.ownerId = a.ownerId,
          this.accountNr = a.accountNr,
          this.amount = a.amount,
          this.firstname = a.owner.firstname,
          this.lastname = a.owner.lastname,
          this.login = a.owner.login
        },
        error: e =>{
          console.log(e);
        }
      })
  }

  ngOnInit(): void {
    this.token = this.localsave.load();
    this.TransactionForm = this.fb.group({
      receiver: ['', Validators.required],
      amount: ['', Validators.required],});
    this.getPersonalAccountInfo();
  }

  logOut(): void{
    localStorage.removeItem('mazebank-jwt');
    this.router.navigate(["/"]);
  }
 
  onSubmit(){
    if(this.TransactionForm.valid){
      this.transactionService.transfer(this.token, {target: this.TransactionForm.value.receiver, amount: this.TransactionForm.value.amount})
      .subscribe(
        (confirmation: TransactionConfirmation) => {
          console.log('Transfer successful:', confirmation);
          this.getPersonalAccountInfo();
          location.reload();
        },
        (error) => {
          console.error('Error during transfer:', error);
        }
      );
    }
  }

  checkAmount(): boolean{
    if(this.amount >= this.TransactionForm.value.amount){
      return false;
    }
    else{return true}
  }

  checkReceiverValidity() : boolean{
    if(this.TransactionForm.value.receiver){
      this.accountservice.getAccountInfo(this.token, this.TransactionForm.value.receiver)
        .subscribe({
          next: info => {
            if(this.TransactionForm.value.receiver == this.accountNr){
              this.errorMessage = "You can't send money to yourself!";
            }
            else{
              this.errorMessage = info.owner.firstname + " " + info.owner.lastname;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = "Unkown account number specified!"
          },
          complete: () => {
          },
        });
      return true
    }else{
      this.errorMessage = "";
      return false
    }
  }

  navCockpit(){
    this.router.navigate(["/cockpit"])
  }
}

