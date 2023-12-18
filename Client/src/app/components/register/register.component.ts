import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/services/account.service';
import { AuthService, Credential } from 'src/app/services/auth.service';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule  } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  animations: [
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

export class RegisterComponent implements OnInit{
  constructor(public authService: AuthService, public localsave: LocalsaveService,private router: Router, private fb: FormBuilder){
  }

  registrationForm!: FormGroup 
  credential!: Credential

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmpassword: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(){
    this.authService.register({login: this.registrationForm.value.username, password: this.registrationForm.value.password, firstname: this.registrationForm.value.firstname, lastname: this.registrationForm.value.lastname})
      .subscribe({
          next: acc => {
            this.authService.login({login: this.registrationForm.value.username, password: this.registrationForm.value.password})
              .subscribe({
                  next: cred => {
                    this.credential = cred;
                    this.localsave.save(cred.token);
                    this.router.navigate(["/dashboard"])

                  },
                error: e => {
                  console.log(e);
                }
            })
            },
      error: e => {
          console.log(e);
      }
    })
  }

  matchPasswords() : boolean {
    if(this.registrationForm.value.password == this.registrationForm.value.confirmpassword){
      return false
    }
    else{
      return true
    }
  }
  

  headerText: string = "Login";
  navToLogin(){
    this.router.navigate(["/login"])
  }
}