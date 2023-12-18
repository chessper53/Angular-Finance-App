import { Component , OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, Credential, LoginInfo } from 'src/app/services/auth.service';
import { LocalsaveService } from 'src/app/services/localsave.service';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule  } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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

export class LoginComponent implements OnInit{
  constructor(public authService: AuthService, public localsave:LocalsaveService, private router: Router, private fb: FormBuilder){}

  loginForm!: FormGroup 
  credentials?: Credential


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],});
  }

  onSubmit(){
      this.authService.login({login: this.loginForm.value.username, password: this.loginForm.value.password}).
      subscribe({
        next: cred =>{
          this.credentials = cred;
          this.localsave.save(cred.token);
          this.router.navigate(["/dashboard"]);
        },
        error: e =>{
          console.log(e);
        }
      })
    }
}
