// import { Component, signal } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { PortfolioService } from '../AllServices/portfolio';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-login',
//   imports: [FormsModule],
//   templateUrl: './login.html',
//   styleUrl: './login.css',
// })
// export class Login {

//   constructor(private portfolio:PortfolioService,
//               private route:Router
//   ){}

//   email='';
//   password='';
//   status = signal('');

//   Login(){
    
//     const data = {
//       email:this.email,
//       password:this.password
//     };

//     this.portfolio.login(data).subscribe({
//       next: (res)=>{
//         this.status.set(res.message);
//         localStorage.setItem('token', res.token!);
//         this.route.navigate(['/dashboard']);
//         console.log(this.status());
//       },

//       error: (err)=>{
//         this.status.set(err.error?.message || "database error");
//         console.log(this.status());
//       }
//     })
//   }

// }
