import { ChangeDetectorRef, Component } from '@angular/core';
import { EducationService } from '../AllServices/education-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop,moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-education',
  imports: [ReactiveFormsModule,NgIf,DragDropModule],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {

  constructor(private EducationService:EducationService,
              private cdr:ChangeDetectorRef,
              private fb:FormBuilder           
  ){}

  educationForm!:FormGroup;
  allEducation: any[] = [];
  isFormOpen = false;
  isEditMode = false;
  educationId!: number;
  educationExist = false;
  selectEducationId: number | null = null;


  ngOnInit(){
    this.getAllEducation();
    this.educationForm = this.fb.group({
    degree: ['', Validators.required],
    field_of_study: [''],
    institution: ['', Validators.required],
    start_year: ['', Validators.required],
    end_year: [''],
    grade: [''],
    status: ['completed'],
    description: [''],
    display_order: ['']
    });
    
  }


  getAllEducation(){

    this.EducationService.getEducation().subscribe({
      next: (res)=>{

        this.allEducation = Array.isArray(res) ? res : [res];
        console.log("All Education:", this.allEducation); 
        
        this.cdr.detectChanges();
      },
      error: () => {
        this.allEducation = [];    
      }
    });
  
  }

  Submit(){
    if(this.educationExist){
      this.UpdateChanges();
    }else{
      this.SaveEducation();
    }

  }

  editEducation(education:any){
    this.isFormOpen = true;
    this.educationExist = true;
    this.educationId = education.id;
    this.selectEducationId = education.id;

    this.educationForm.patchValue({
      degree: education.degree,
      field_of_study: education.field_of_study,
      institution: education.institution,
      start_year: education.start_year,
      end_year: education.end_year,
      grade: education.grade,
      status: education.status,
      description: education.description,
      display_order: education.display_order
    });
  }

  UpdateChanges(){

    const data = {
      id:this.educationId,
      degree: this.educationForm.get('degree')?.value,
      field_of_study: this.educationForm.get('field_of_study')?.value,
      institution: this.educationForm.get('institution')?.value,
      start_year: this.educationForm.get('start_year')?.value,
      end_year: this.educationForm.get('end_year')?.value,
      grade: this.educationForm.get('grade')?.value,
      status: this.educationForm.get('status')?.value,
      description: this.educationForm.get('description')?.value,
      display_order: this.educationForm.get('display_order')?.value,
    }

    this.EducationService.updateChanges(data).subscribe({
      next: (res)=>{
        console.log(res);
        this.getAllEducation();
        this.educationForm.reset();
        this.educationExist = false;
      },

      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  SaveEducation(){

    const display_order = this.allEducation.length;

     const data = {
      degree: this.educationForm.get('degree')?.value,
      field_of_study: this.educationForm.get('field_of_study')?.value,
      institution: this.educationForm.get('institution')?.value,
      start_year: this.educationForm.get('start_year')?.value,
      end_year: this.educationForm.get('end_year')?.value,
      grade: this.educationForm.get('grade')?.value,
      status: this.educationForm.get('status')?.value,
      description: this.educationForm.get('description')?.value,
      display_order,
    }

    this.EducationService.saveEducation(data).subscribe({
      next: (res)=>{
        console.log(res);
        this.getAllEducation();
        this.educationForm.reset();
        this.isFormOpen= false;
        
      },

      error: (err)=>{
        console.log(err);
        
      }
    });
    
  }

  deleteEducation(id:number | null){

    this.EducationService.deleteEducation(id!).subscribe({
      next: (res)=>{
        console.log(res);
        this.getAllEducation();
      },
      error: (err)=>{
        console.log(err);
        
      }
    });

    this.isFormOpen = false;
    this.educationExist =false;
    this.educationForm.reset();
  }


  drop(event: CdkDragDrop<any[]>) {
  moveItemInArray(
    this.allEducation,
    event.previousIndex,
    event.currentIndex
  );


  const reordered = this.allEducation.map((education, index) => ({
    id: education.id,
    display_order: index
    
  }));

  
 this.EducationService.updateEducationOrder(reordered).subscribe({
  next: (res)=>{
    console.log(res);
  },
  error: (err)=>{
    console.log(err);
    
  }

 });
  // Optional: auto-save new order
  console.log('New order:', this.allEducation);
}


  addEducation(){
    this.isFormOpen = true;
    this.selectEducationId = null;
    this.educationExist = false;
  }

  closeForm(){
    this.isFormOpen = false;
    this.isEditMode = false;
    this.selectEducationId = null;
    this.educationForm.reset();
  }


}


