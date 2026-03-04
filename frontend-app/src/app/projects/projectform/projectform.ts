import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../../AllServices/project-service';
import { FormArray, FormBuilder, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-projectform',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './projectform.html',
  styleUrl: './projectform.css',
})
export class Projectform {

   constructor(private projectService:ProjectService,
              private fb:FormBuilder,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef
  ){}

  projectView!:FormGroup;
  allTech: string |null = '';
  projectId: number | null = null;
  isEditMode = false;
  features: any[]=[];
  thumbnailImage!: string;
   projectImages:any[]=[];
   selectedImage: string | null = null;
   profileImage!:string;
   title!:string;
   full_name!:string;
   imageUrl!:string;


 ngOnInit() {
  this.projectForm();

  this.route.paramMap.subscribe(params => {
    const idParam = params.get('id');

    if(!idParam) return;
    const id = Number(idParam);

    if (isNaN(id)) return;

    this.projectService.getProjectById(id).subscribe(project =>{
      if(!project) return;

    this.projectView.patchValue({
      title: project.title,
      short_description: project.short_description,
      description: project.description,
      github_url: project.github_url,
      live_url: project.live_url,
      status: project.status,
      project_type: project.project_type,
      is_public: project.is_public,

    });

    this.features=project.features;

    this.allTech = project.tech_stack;

    this.projectImages=project.images;
     

     if (this.projectImages.length) {
    this.selectedImage = this.projectImages[0].url;
  }


    this.projectService.getProfile().subscribe(profile=>{
      this.title = profile.title;
      this.full_name = profile.full_name;
      this.profileImage = profile.profile_image;

       if (this.profileImage) {
      this.imageUrl = `http://localhost:3000/upload_images/${this.profileImage}`;
    } else {
      this.imageUrl = `https://lh3.googleusercontent.com/aida-public/AB6AXuBsIXM3k71N8XAHteq1JUO6PlRCWVBmBZM0Js8LkfbMGel0qWS9JgDRpiVYG3cFrt
      -nhOnOXAGnMSblNy8qNkrLf0gGmCVLQfqcdC8KMktCiMX0Pa6Og_5eZP27iB3HGcQXqHscHvBRm-whL3rmmJMNOna0x26cxfEw_Kne7j1T56SeQ5T4T2d-eAvRWpaqx_560M9qyKFZNclbRBYO4zN_
      Nhv39LY1dToKkbAxzZfB1mmaZQ4_M5_l8QJubizTDrN2tyxtynEhEz5h`; 
    }
    this.cdr.detectChanges();
    }
  )
      

    })
  });
}



selectImage(url: string) {
  this.selectedImage = url;
}

  
get descriptionParagraphs(): string[] {
  const desc = this.projectView.value.description;
  if (!desc) return [];

return desc
  .split(/(?<=[.!?])\s+/)
  .map((p:any) => p.trim())
  .filter((p:any) => p.length > 0);
}


 projectForm() {
    this.projectView = this.fb.group({
      title: [''],
      short_description: [''],
      description: [''],
      tech_stack: [''],
      github_url: [''],
      live_url: [''],
      status: ['completed'],
      project_type: ['personal'],
      is_public: [true],
      //features: ['']
    });
  }

}


