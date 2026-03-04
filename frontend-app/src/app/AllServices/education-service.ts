import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EducationService {

  constructor(private http:HttpClient){}

    Url= 'http://localhost:3000/api/';


    getEducation(){
      return this.http.get(this.Url+"education");
    }
  
    updateChanges(data:any){
      return this.http.put<any>(this.Url+"education",data);
    }

    saveEducation(data:any){
      return this.http.post(this.Url+"education",data);
    }

    deleteEducation(id:number){
      return this.http.delete(this.Url+`education/${id}`);
    }

    updateEducationOrder(data:any){
      return this.http.put<any>(this.Url+"education/reorder",data)
    }
}
