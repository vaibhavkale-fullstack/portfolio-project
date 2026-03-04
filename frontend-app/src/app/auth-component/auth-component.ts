import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Authservice } from '../AllServices/authservice';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-auth-component',
  imports: [NgIf,FormsModule],
  templateUrl: './auth-component.html',
  styleUrl: './auth-component.css',
})


export class AuthComponent {

  constructor(private authservice:Authservice,
              private route:Router
  ){}

   isLogin = false; // default = Sign Up (matches your current UI)
   login_email='';
   signup_email='';
   login_password=''
   signup_password='';

   full_name = '';
   confirm_password='';
   status = signal('');
   
   
   onSubmit(){
    if(this.isLogin){
      this.showLogin();
    }else{
      this.showSignup();
    }
   }


  showLogin() {
    
   const data = {
      email:this.login_email,
      password:this.login_password
    };


    this.authservice.login(data).subscribe({
      next: (res)=>{
        this.status.set(res.message);
        localStorage.setItem('token', res.token!);
        localStorage.setItem("username", res.username);
        this.route.navigate(['/dashboard']);
        console.log(this.status());
      },

      error: (err)=>{
        this.status.set(err.error?.message || "database error");
        console.log(this.status());
      }
    })
  }


showSignup() {

  if (this.signup_password != this.confirm_password) {
    this.status.set("Password not match");
    return;
  }

  const data = {
    full_name: this.full_name,   // 🔥 IMPORTANT: backend uses "name"
    email: this.signup_email,
    password: this.signup_password
  };

  localStorage.clear();
console.log(data);

  this.authservice.signUp(data).subscribe({
    next: (res) => {

      this.status.set(res.message);

      // 🔥 STORE NEW SESSION
      localStorage.setItem("token", res.token);
      localStorage.setItem("username", res.username);

      // 🔥 GO TO NORMAL DASHBOARD
      this.route.navigate(['/dashboard']);
    },

    error: (err) => {
      this.status.set(err.error?.message || "database error");
    }
  });
}


  toggleLogin(){
    this.isLogin=true;
  }

  toggleSignup(){
    this.isLogin=false;
  }

  }

 



