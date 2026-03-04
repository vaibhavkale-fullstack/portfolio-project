import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { PortfolioService } from '../AllServices/portfolio';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  @ViewChild('fileInput') fileInputRef!: ElementRef;
  @ViewChild('resumeupload') resumeInputRef!: ElementRef;


  constructor(
    private portfolio: PortfolioService,
    private cdr: ChangeDetectorRef
  ) {}

  full_name = '';
  title = '';
  city = '';
  github = '';
  email = '';
  linkedin = '';
  website = '';
  phone = '';
  bio = '';
  status = '';
  profileExists = false;
  profileImage = '';
  selectedFile!: File;
  isEditMode = false;
  imageUrl: string = '';
  selectedResume!: File;
  resumeFileName: string = '';
  showStoredName!: string;
  isCopied = false;

  originalData: any = {};

  ngOnInit() {
    this.checkProfile();
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.updateImageUrl();
        this.cdr.detectChanges(); // important
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  onResumeSelect(event: any) {
    if (event.target.files.length > 0) {
      this.selectedResume = event.target.files[0];
      this.resumeFileName = this.selectedResume.name;
      //console.log(this.resumeFileName);
    }
  }

  backendUrl = 'http://localhost:3000';  // change in production

openResume() {
  if (!this.showStoredName) return;

  const resumeUrl = `${this.backendUrl}/upload_resumes/${this.showStoredName}`;
  window.open(resumeUrl, '_blank');
}

copyResumeLink() {
  if (!this.showStoredName) return;

  const resumeUrl = `${this.backendUrl}/upload_resumes/${this.showStoredName}`;

  navigator.clipboard.writeText(resumeUrl)
    .then(() => {
      this.isCopied = true;
       this.cdr.detectChanges();

      setTimeout(() =>{
         this.isCopied = false;
         this.cdr.detectChanges();
        }, 2000);
    });
}



  checkProfile() {
    this.isEditMode = true;

    this.portfolio.getProfile().subscribe({
      next: (res) => {
        this.profileExists = true;
        this.isEditMode = false;

        this.full_name = res.full_name;
        this.title = res.title;
        this.bio = res.bio;
        this.city = res.city;
        this.email = res.email;
        this.phone = res.phone;
        this.website = res.website;
        this.linkedin = res.linkedin;
        this.github = res.github;
        this.profileImage = res.profile_image;
        this.resumeFileName = res.resume_original_name;

        this.showStoredName = res.resume;     

        this.updateImageUrl();
        this.originalData = { ...res };

        this.cdr.detectChanges();
      },
      error: () => {
        this.profileExists = false;
      }
    });
  }

  enableEdit() {
    this.isEditMode = true;
  }

  cancelEdit() {
    this.full_name = this.originalData.full_name;
    this.title = this.originalData.title;
    this.bio = this.originalData.bio;
    this.city = this.originalData.city;
    this.email = this.originalData.email;
    this.phone = this.originalData.phone;
    this.website = this.originalData.website;
    this.linkedin = this.originalData.linkedin;
    this.github = this.originalData.github;
    this.profileImage = this.originalData.profile_image;
    this.resumeFileName = this.originalData.resume_original_name;

    this.selectedFile = undefined as any; // VERY IMPORTANT

    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }

    if (this.resumeInputRef) {
  this.resumeInputRef.nativeElement.value = '';
}


    this.updateImageUrl();
    this.isEditMode = false;
  }

  saveProfile() {
    const formData = new FormData();

    formData.append('full_name', this.full_name);
    formData.append('title', this.title);
    formData.append('bio', this.bio);
    formData.append('city', this.city);
    formData.append('email', this.email);
    formData.append('phone', this.phone);
    formData.append('website', this.website);
    formData.append('linkedin', this.linkedin);
    formData.append('github', this.github);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (!this.profileImage) {
      formData.append('removeImage', 'true');
    }

    if (this.selectedResume) {
      formData.append('resume', this.selectedResume);
    }

    if (!this.resumeFileName) {
      formData.append('removeResume', 'true');
    }

    if (this.profileExists) {
      this.portfolio.updateProfile(formData).subscribe({
        next: (res) => {
          alert(res.message);
          this.checkProfile();

          this.selectedFile = undefined as any;

          if (this.fileInputRef) {
            this.fileInputRef.nativeElement.value = '';
          }

          if (this.resumeInputRef) {
  this.resumeInputRef.nativeElement.value = '';
}


          this.isEditMode = false;
        },
        error: (err) => alert(err.error.message),
      });

    } else {
      this.portfolio.createProfile(formData).subscribe({
        next: (res) => {
          this.checkProfile();
          alert(res.message);

          this.profileExists = true;
          this.originalData = { ...res.data };
          this.selectedFile = undefined as any;
          this.isEditMode = false;
        },
        error: (err) => alert(err.error.message),
      });
    }
  }

  updateImageUrl() {
    if (!this.profileImage) {
      this.imageUrl =
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBsIXM3k71N8XAHteq1JUO6PlRCWVBmBZM0Js8LkfbMGel0qWS9JgDRpiVYG3cFrt-nhOnOXAGnMSblNy8qNkrLf0gGmCVLQfqcdC8KMktCiMX0Pa6Og_5eZP27iB3HGcQXqHscHvBRm-whL3rmmJMNOna0x26cxfEw_Kne7j1T56SeQ5T4T2d-eAvRWpaqx_560M9qyKFZNclbRBYO4zN_Nhv39LY1dToKkbAxzZfB1mmaZQ4_M5_l8QJubizTDrN2tyxtynEhEz5h';
      return;
    }

    if (this.profileImage.startsWith('data:image')) {
      this.imageUrl = this.profileImage;
    } else {
      this.imageUrl = `http://localhost:3000/upload_images/${this.profileImage}`;
    }
  }

  removeImage() {
    this.profileImage = '';
    this.selectedFile = undefined as any;
    this.updateImageUrl();
  }

  removeResume() {
    this.resumeFileName = '';
    this.selectedResume = undefined as any;
  }
}
