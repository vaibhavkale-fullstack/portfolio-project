import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { login, loginRes, signup, signupRes } from '../Interfaces/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class Authservice {

  constructor(private http: HttpClient) {}

Url= 'http://localhost:3000/api/';


    signUp(data:signup):Observable<signupRes>{
    return this.http.post<signupRes>(this.Url+"auth/signup",data)
  }

  login(data:login){
    return this.http.post<loginRes>(this.Url+"auth/login",data);
  }

    isLoggedIn():boolean{
    return Boolean(localStorage.getItem('token'));
  }
  
}
