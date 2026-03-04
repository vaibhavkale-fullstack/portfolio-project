import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root',
})
export class DashboardService {

   constructor(private http: HttpClient) {}

  Url= 'http://localhost:3000/api/';


  getProfileImageForDashboard() {
  return this.http.get('http://localhost:3000/api/profile');
}

getProfileStrength(){

  return this.http.get('http://localhost:3000/api/dashboard/profile-strength');
}

getProfileViews() {
  return this.http.get('http://localhost:3000/api/dashboard/profile-views');
}

getRecruiterMessages() {
  return this.http.get('http://localhost:3000/api/dashboard/recruiter-messages');
}

getAllProjects(){
        return this.http.get<any>('http://localhost:3000/api/project');
}

markMessageAsRead(id: number) {
  return this.http.put(
    `http://localhost:3000/api/dashboard/${id}/read`,
    {}
  );
}


}
