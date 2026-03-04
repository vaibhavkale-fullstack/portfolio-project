import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class ProjectService {

   constructor(private http:HttpClient){}

    Url= 'http://localhost:3000/api/';

    getAllProjects(){
      return this.http.get<any>(this.Url+"project");
    }

    getProjectById(id:number){
      return this.http.get<any>(this.Url+`project/${id}`)
    }

    updateProject(data:any){
      return this.http.put<any>(this.Url+"project",data);
    }

    saveProject(data:FormData){
      return this.http.post<any>(this.Url+"project",data);
    }
  
    deleteProject(id:number){
      return this.http.delete(this.Url+`project/${id}`);
    }

    deleteImage(id:number){
      
      return this.http.delete(this.Url+`project/project-image/${id}`);
    }

    getProfile() {
      return this.http.get<any>(this.Url + 'profile');
  }
}
