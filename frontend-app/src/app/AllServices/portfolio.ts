import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })


export class PortfolioService {
  constructor(private http: HttpClient) {}

  Url= 'http://localhost:3000/api/';


  
  isLoggedIn():boolean{
    return Boolean(localStorage.getItem('token'));
  }

  getProfile() {
  return this.http.get<any>(this.Url + 'profile');
  }

  createProfile(data: FormData) {
    return this.http.post<any>(this.Url + 'profile', data);
  }

  updateProfile(data: FormData) {
    
    return this.http.put<any>(this.Url + 'profile/update-profile', data);
  }

 getPortfolio(username: string) {
  return this.http.get<any>(
    `http://localhost:3000/api/recruiter/${username}`
  );
}

receiveMessages(data:any){
  return this.http.post(`http://localhost:3000/api/recruiter`,data)
}
   
}
