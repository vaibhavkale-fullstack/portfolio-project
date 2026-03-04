import { ChangeDetectorRef, Component } from '@angular/core';
import { ExperienceService } from '../AllServices/experience-service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  FormBuilder,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule} from '@angular/common';


@Component({
  selector: 'app-experience',
  imports: [ReactiveFormsModule, CommonModule, DragDropModule],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})


export class Experience {
  constructor(
    private ExperienceService: ExperienceService,
    private cdr: ChangeDetectorRef,
  ) {}

 
  experienceExist = false;
  experienceid!: number;
  Allexperiences: any[] = [];

 

  isFormOpen = false;
  isEditMode = false;
  selectedExperienceId: number | null = null;
  currently_working = false;

 

  ngOnInit(){
    this.getExperiences();
     this.experience.get('currentlyWorking')?.valueChanges.subscribe((isWorking) => 
      {
      const endDateControl = this.experience.get('end_date');

      if (isWorking) {

        endDateControl?.disable();   //  disable end date
        endDateControl?.reset();     //  clear value
      } else {

        endDateControl?.enable();    //  enable again
      }
    });
  }

//-------------------- Drag Experiences -----------------------  

drop(event: CdkDragDrop<any[]>) {
  moveItemInArray(
    this.Allexperiences,
    event.previousIndex,
    event.currentIndex
  );


  const reordered = this.Allexperiences.map((exp, index) => ({
    id: exp.id,
    display_order: index
    
  }));

  
 this.ExperienceService.updateExperienceOrder(reordered).subscribe({
  next: (res)=>{
    console.log(res);
  },
  error: (err)=>{
    console.log(err);
    
  }

 });
  // Optional: auto-save new order
  console.log('New order:', this.Allexperiences);
}



//----------------- After entering , code --------------------

onTechKeydown(event: KeyboardEvent, input: HTMLInputElement) {
  const value = input.value.trim();

  // Trigger on comma or Enter
  if (event.key === ',' || event.key === 'Enter') {
    event.preventDefault();

    if (!value) return;

    // Prevent duplicates (optional but recommended)
    const exists = this.techStackArray.controls
      .some(ctrl => ctrl.value?.toLowerCase() === value.toLowerCase());

    if (exists) {
      input.value = '';
      return;
    }

    this.techStackArray.push(new FormControl(value,{nonNullable:true}));
    input.value = '';
  }
}



  onAddExperience() {
    this.isFormOpen = true;
    this.isEditMode = false;
    this.selectedExperienceId = null;
    this.experience.reset(); // EMPTY FORM
    this.techStackArray.clear();
    this.experienceExist=false;
  }

  Submit() {
    if (this.experienceExist) {
      this.saveChanges();
    } else {
      this.createExperience();
    }
  }


  
  experience = new FormGroup({
    company_name: new FormControl(''),
    role: new FormControl(''),
    employment_type: new FormControl('', Validators.required),
    currentlyWorking: new FormControl(false),
    start_date: new FormControl(),
    end_date: new FormControl(),
    description: new FormControl(),
    location: new FormControl(),
    display_order: new FormControl(),
    tech_stack: new FormControl(),
    techArray: new FormArray<FormControl<string>>([]),
  });


  get techStackArray() {
    return this.experience.get('techArray') as FormArray<FormControl<string>>;
  }



getExperiences() {
  this.ExperienceService.getAllExperiences().subscribe({
    next: (res) => {
    
   this.Allexperiences = Array.isArray(res) ? res : [res];
   console.log('Experiences:', this.Allexperiences);

  this.cdr.detectChanges();
    },
    error: () => {
      this.Allexperiences = [];
    }
  });
}



 editExperience(exp: any) {
  this.experienceid = exp.id;
  this.experienceExist = true;
  this.selectedExperienceId = exp.id;
  this.isEditMode = true;
  this.isFormOpen = true;

  // data coming from html for loop and going into experience FormControl through patchvalue

  this.experience.patchValue({
    company_name: exp.company_name,
    role: exp.role,
    employment_type: exp.employment_type,
    currentlyWorking: exp.is_current === 1,
    start_date: this.formatForMonth(exp.start_date),
    end_date: this.formatForMonth(exp.end_date),
    description: exp.description,
    location: exp.location,
    display_order: exp.display_order
  });



   if (exp.is_current === 1) {
    this.experience.get('end_date')?.disable();
  } else {
    this.experience.get('end_date')?.enable();
  }

  this.techStackArray.clear();

  if (exp.tech_stack) {
    exp.tech_stack.split(',').forEach((t: string) => {
      this.techStackArray.push(new FormControl(t, {nonNullable:true}));
    });
    this.cdr.detectChanges();
  }
}



  formatForMonth(date: string | Date | null) {
    if (!date) return null;

    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }


  addTech(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = keyboardEvent.target as HTMLInputElement;
    //console.log(input.value);

    const value = input.value.trim();
    if (!value) return;

    this.techStackArray.push(new FormControl(value, { nonNullable: true }));
    input.value = '';
  }



  saveChanges() {
    const formatToSQLDate = (value: string | null) => {
      if (!value) return null;
      return `${value}-01`; // adds day
    };
    const raw = this.experience.getRawValue();

    const data = {
      id: this.experienceid,
      company_name: this.experience.get('company_name')?.value,
      role: this.experience.get('role')?.value,
      employment_type: this.experience.get('employment_type')?.value,
      is_current: raw.currentlyWorking ? 1 : 0,
      start_date: formatToSQLDate(this.experience.get('start_date')?.value),
      end_date: formatToSQLDate(this.experience.get('end_date')?.value),
      description: this.experience.get('description')?.value,
      location: this.experience.get('location')?.value,
      display_order: this.experience.get('display_order')?.value,
      // convert FormArray → "Angular,Node,Docker"
      tech_stack: this.techStackArray.value.join(','),
      
    };

    this.ExperienceService.updateExperience(data).subscribe({
      next: (res) => {
        this.getExperiences();
        this.experience.reset();
        this.techStackArray.clear();
        this.experienceExist=false;
        console.log(res.message);
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
    
  }



  createExperience() {
    const formatToSQLDate = (value: string | null) => {
      if (!value) return null;
      return `${value}-01`; // adds day
    };

    const raw = this.experience.getRawValue();
    const display_order = this.Allexperiences.length;
    

    const data = {
      company_name: this.experience.get('company_name')?.value,
      role: this.experience.get('role')?.value,
      employment_type: this.experience.get('employment_type')?.value,
      is_current: raw.currentlyWorking ? 1 : 0,      
      start_date: formatToSQLDate(this.experience.get('start_date')?.value),
      end_date: formatToSQLDate(this.experience.get('end_date')?.value),
      description: this.experience.get('description')?.value,
      location: this.experience.get('location')?.value,
      display_order,
      // convert FormArray → "Angular,Node,Docker"
      tech_stack: this.techStackArray.value.join(','),
    };

    
    this.ExperienceService.saveExperience(data).subscribe({
      next: (res) => {
        console.log(res.message);
        this.getExperiences(); // this is use to get the thumbnail instantly after saving experience
        this.experience.reset();
        this.techStackArray.clear();
        //this.cdr.detectChanges();

      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  

  closeForm() {
    this.isFormOpen = false;
    this.isEditMode = false;
    this.experienceExist = false;
    this.selectedExperienceId = null;
    this.experience.reset();
    this.techStackArray.clear();

  }


  deleteExperience(id: number | null) {
  if (!id) return;
    
    this.ExperienceService.deleteExperience(id).subscribe({
      next: (res)=>{
        this.getExperiences();
        console.log(res);   
      },

      error: (err)=>{
        console.log(err.error.message);
      }
    })

    this.isFormOpen = false;
    this.experienceExist = false;
    this.experience.reset();
    this.techStackArray.clear();

  }


  removeTech(index: number) {
    this.techStackArray.removeAt(index);
  }
}
