import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
    constructor(private http: HttpClient) {}

  Url= 'http://localhost:3000/api/';

    updateExperience(data: any){
    return this.http.put<any>(this.Url+"experience",data);
  }

   updateExperienceOrder(data: any){
    return this.http.put<any>(this.Url+"experience/reorder",data);
  }

  saveExperience(data:any){
    return this.http.post<any>(this.Url+"experience",data);
  }

  getAllExperiences(){
    return this.http.get<any>(this.Url+"experience");
  }

  deleteExperience(deleteId:any){
    return this.http.delete<any>(this.Url+`experience/${deleteId}`);
  }
  
}
