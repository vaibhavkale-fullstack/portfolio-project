import { ChangeDetectorRef, Component } from '@angular/core';
import { ProjectService } from '../AllServices/project-service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  constructor(
    private projectService: ProjectService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  @ViewChild('projectFormSection') formSection!: ElementRef;
  @ViewChildren('featureInput') featureInputs!: QueryList<ElementRef>;

  projectForm!: FormGroup;
  projectId: number | null = null;
  isEditMode = false;
  allProjects: any[] = [];
  formClose = false;
  deleteProjectId: number | null = null;
  selectedFiles: File[] = [];
  projectImages:any[]=[];
  previewImages:any[]=[];
  deletedImageIds: number[] = [];


  ngOnInit() {
    this.initializeForm();
    this.getAllProjects();
  }

  initializeForm() {
   this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(150)]],
      short_description: ['', [Validators.required, Validators.maxLength(300)]],
      description: ['', Validators.required],
      tech_stack: this.fb.array([]),

      github_url: [''],
      live_url: [''],

      project_type: ['Personal'], // personal | company | freelance
      status: ['completed'], // completed | in_progress

      is_public: [true],
      display_order: [0],
      features: this.fb.array([]),
      images: this.fb.array([])
    });
  }

  addProject() {
    this.formClose = true;
    this.isEditMode = false;
    this.projectId = null;
    this.initializeForm();
    this.techStackArray.clear();
    this.allFeatures.clear();
    this.projectImages = [];

    setTimeout(() => {
      this.formSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }

  //---------- Create New Project-------------------

  get allFeatures(): FormArray {
    return this.projectForm.get('features') as FormArray;
  }

  get techStackArray(): FormArray {
    return this.projectForm.get('tech_stack') as FormArray;
  }



onFileSelect(event: any) {
  const files: File[] = Array.from(event.target.files);

  if (!files.length) return;

  // Limit total images to 5 (existing + new)
  if ((this.projectImages.length + this.previewImages.length + files.length) > 5) {
    alert("Maximum 5 images allowed");
    return;
  }

  files.forEach(file => {
    this.selectedFiles.push(file);

    const previewUrl = URL.createObjectURL(file);

    this.previewImages.push({
      file: file,
      url: previewUrl,
      isNew: true
    });
  });

  // Reset input so same file can be selected again if needed
  event.target.value = '';
}

removePreview(preview: any) {

  this.previewImages = this.previewImages.filter(p => p !== preview);

  this.selectedFiles = this.selectedFiles.filter(f => f !== preview.file);

}



saveNewProject() {

  const formValue = this.projectForm.value;
  const formData = new FormData();

formData.append('title', formValue.title);
formData.append('short_description', formValue.short_description);
formData.append('description', formValue.description);
formData.append('github_url', formValue.github_url);
formData.append('live_url', formValue.live_url);
formData.append('status', formValue.status);
formData.append('project_type', formValue.project_type);
formData.append('is_public', formValue.is_public?'1':'0');
formData.append('tech_stack', this.techStackArray.value.join(','));

formValue.features
  .filter((f: any) => f.feature?.trim())
  .forEach((f: any) => {
    formData.append('features[]', f.feature.trim());
  });

 
 this.selectedFiles.forEach(file => {
  formData.append('images', file);
});


  this.projectService.saveProject(formData).subscribe({
    next: (res) => {
      console.log(res);
      this.getAllProjects();
      this.projectForm.reset({
      project_type: 'personal',
      status: 'completed',
      is_public: true,
      display_order: 0
});
      this.allFeatures.clear();
      this.techStackArray.clear();
      this.projectImages=[];
      this.previewImages=[];
    },
    error: (err) => {
      console.log(err);
    }
  });
}

  

  addTech(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    const input = keyboardEvent.target as HTMLInputElement;

    const value = input.value.trim();
    if (!value) return;
    //console.log(value);

    this.techStackArray.push(this.fb.control(value));
    input.value = '';
  }

 addFeatureInput() {
  this.allFeatures.push(
    this.fb.group({
      id: [],
      feature: ['']
    })
  );

}

removeFeature(index: number) {
  this.allFeatures.removeAt(index);
}

onFeatureEnter(event: Event) {
  event.preventDefault();
  this.addFeatureInput();

   setTimeout(() => {
    const inputs = this.featureInputs.toArray();
    const lastInput = inputs[inputs.length - 1];
    lastInput.nativeElement.focus();
  });
}

previewProject(projectId:number){
 
this.router.navigate(['/projectform', projectId]);
}

  //------------Get Project by id to Edit Project--------------------------

 editProject(proId: number) {
  this.isEditMode = true;
  this.formClose = true;
  this.projectId = proId;
  this.deleteProjectId = proId;
  

  this.projectService.getProjectById(proId).subscribe((project) => {
    if (!project) return;

    this.projectForm.patchValue({
      title: project.title,
      short_description: project.short_description,
      description: project.description,
      github_url: project.github_url,
      live_url: project.live_url,
      status: project.status,
      project_type: project.project_type,
      is_public: project.is_public,
    });

       this.techStackArray.clear();

    if (project.tech_stack) {
      project.tech_stack.split(',').forEach((t: string) => {
        this.techStackArray.push(
          this.fb.control(t.trim())
        );
      });

      this.cdr.detectChanges();
    }

     // ---------- FEATURES ----------
    this.allFeatures.clear();

    if (project.features && project.features.length) {
      project.features.forEach((f: any) => {
        this.allFeatures.push(
          this.fb.group({
            id: [f.id || null],
            feature: [f.feature || '']
          })
        );
         
      });
      this.cdr.detectChanges();
    }

    this.projectImages = project.images.map((img: any) => img);
    //console.log(this.projectImages);
    
    
      setTimeout(() => {
        this.formSection.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 0);
    });
  }

  //--------Get all projects as Thumbnail------------------
  getAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (res) => {
        this.allProjects = Array.isArray(res) ? res : [res]; // it is used for project thumbnail
        console.log('AllProjects: ', res);
       // console.log('projectImages: ', res.image_url);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //----------------Save updated Project---------------
  SaveUpdate() {
  const formValue = this.projectForm.value;

  const formData = new FormData();

  formData.append('id', this.projectId!.toString());
  formData.append('title', formValue.title);
  formData.append('short_description', formValue.short_description);
  formData.append('description', formValue.description);
  formData.append('github_url', formValue.github_url);
  formData.append('live_url', formValue.live_url);
  formData.append('status', formValue.status);
  formData.append('project_type', formValue.project_type);
  formData.append('is_public', formValue.is_public ? '1' : '0');
  formData.append('tech_stack', this.techStackArray.value.join(','));

  // Features
  formValue.features
    .filter((f: any) => f.feature?.trim())
    .forEach((f: any) => {
      formData.append('features[]', f.feature.trim());
    });

  // New Images (if selected)
  if (this.selectedFiles && this.selectedFiles.length > 0) {
    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });
  }

  // Send deleted images
this.deletedImageIds.forEach(id => {
  formData.append('deletedImages[]', id.toString());
});


  this.projectService.updateProject(formData).subscribe({
    next: (res) => {
      console.log(res);
      this.getAllProjects();
      this.techStackArray.clear();
      this.projectForm.reset({
        project_type: 'personal',
        status: 'completed',
        is_public: true,
        display_order: 0
      });
      this.isEditMode = false;
      this.allFeatures.clear();
      this.selectedFiles = [];
      this.projectImages = [];
      this.previewImages =[];
    },
    error: (err) => {
      console.log(err);
    }
  });
}



deleteImage(imageId: number) {

  // Store id for later deletion
  this.deletedImageIds.push(imageId);

  // Remove from UI
  this.projectImages = this.projectImages.filter(img => img.id !== imageId);

  // Handle thumbnail locally
  if (!this.projectImages.some(img => img.is_thumbnail)) {
    if (this.projectImages.length > 0) {
      this.projectImages[0].is_thumbnail = true;
    }
  }

  this.cdr.detectChanges();
}




  deleteProject(id:number){
    this.projectService.deleteProject(id).subscribe(data=>{
      console.log(data);

      this.cdr.detectChanges();
      this.getAllProjects();
      this.techStackArray.clear();
      this.allFeatures.clear();
      this.projectForm.reset();
      this.deleteProjectId = null;
      this.formClose = false;
      this.isEditMode = false;
    });
  }



  closeForm() {
    this.projectForm.reset();
    this.techStackArray.clear();
    this.allFeatures.clear();
    this.isEditMode = false;
    this.formClose = false;
    this.projectImages=[];
    this.previewImages=[];
  }

  Submit() {
    if (this.isEditMode) {
      this.SaveUpdate();
    } else {
      this.saveNewProject();
    }
  }
}
