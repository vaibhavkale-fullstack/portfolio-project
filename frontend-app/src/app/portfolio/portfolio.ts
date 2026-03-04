import { ChangeDetectorRef, Component } from '@angular/core';
import { PortfolioService } from '../AllServices/portfolio';
import { CommonModule, NgFor } from '@angular/common';
import { ExperienceService } from '../AllServices/experience-service';
import { EducationService } from '../AllServices/education-service';
import { ProjectService } from '../AllServices/project-service';
import { ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.css',
})
export class Portfolio {

  constructor(private profile:PortfolioService,
              private experience: ExperienceService,
              private education: EducationService,
              private project: ProjectService,
              private route: Router,
              private router: ActivatedRoute,
              private fb: FormBuilder,
              private cdr: ChangeDetectorRef

  ){}

  role='';
  bio='';
  company_name='';
  allExperiences:any[]=[];
  allEducation:any[]=[];
  allProjects:any[]=[];
  projectImage!:string;
  imageUrl!:string;
  email='';
  city='';
  contactMe!:FormGroup;
  profileImage!:string;
  full_name!:string;
  
  descriptionParagraphs: string[] = [];


  ngOnInit(){
   this.contactForm();
    //-------------------------profile image and bio---------------------

    this.profile.getProfile().subscribe(profile=>{
      this.role = profile.title
      this.bio = profile.bio
      this.email = profile.email;
      this.city=profile.city;
      this.full_name = profile.full_name;
      this.profileImage = profile.profile_image;
      console.log(profile);

  //  this.descriptionParagraphs = this.bio
  //     ? this.bio.split(/(?<=[.!?])\s+/).map(p => p.trim()).filter(p => p.length > 0)
  //     : [];
       this.cdr.detectChanges();
    });

    //-------------------------Experience----------------------
  
    this.experience.getAllExperiences().subscribe(exp=>{
      this.allExperiences = exp;
      this.cdr.detectChanges();         
      //console.log(this.allExperiences); 
    });

    //-------------------------Education-------------------------

    this.education.getEducation().subscribe(edu=>{
      this.allEducation = Array.isArray(edu)? edu : [edu];
      this.cdr.detectChanges();
      //console.log(this.allEducation);
      
    });
    
    //----------------------Project-------------------------------

    this.project.getAllProjects().subscribe(project=>{
      this.allProjects = Array.isArray(project)? project : [project];

      //console.log("Project",project);

      this.cdr.detectChanges();
      
    });


    this.router.paramMap.subscribe(params => {
  const username = params.get('username');

  if (username) {
    this.profile.getPortfolio(username)
      .subscribe(data => {

        this.role = data.title;
        this.bio = data.bio;
        this.email = data.email;
        this.city = data.city;
        this.full_name = data.full_name;
        this.profileImage = data.profile_image;

        this.cdr.detectChanges();
      });
  }
});

  }

  projectDetails(id:number){
     this.route.navigate(['/projectform',id])
  }

  contactForm(){
  this.contactMe = this.fb.group({
  name:['', Validators.required],
  email:['', [Validators.required, Validators.email]],
  message:['', Validators.required]
});
  }

  
  recruiterMessage(){

  const data={
      name: this.contactMe.get('name')?.value,
      email: this.contactMe.get('email')?.value,
      message: this.contactMe.get('message')?.value
    }

    this.profile.receiveMessages(data).subscribe({
      next: (res)=>{
        console.log(res);
        this.contactMe.reset();
      }
    })
  }


}




