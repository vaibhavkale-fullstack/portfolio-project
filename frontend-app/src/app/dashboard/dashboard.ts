import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DashboardService } from '../AllServices/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})


export class Dashboard {
  constructor(private router: Router,
              private profile: DashboardService,
              private cdr: ChangeDetectorRef
  ){}

   isProfileMenuOpen = false;
   profileImage = '';
   role='';
   full_name='';
   imageUrl='';
   indicator='';
   totalViews = 0;
   percentageIncrease = 0;
   
allProjects:any[]=[];
displayedProjects: any[] = [];
showAll = false;

profileStrength = 0;
missingSections: any[] = [];

selectedTab: 'unread' | 'read' = 'unread';
showMessageModal = false;
allMessages: any[] = [];
totalMessages = 0;
unreadMessages = 0;
message="";

ngOnInit() {

  this.profile.getProfileStrength().subscribe((res:any) => {

    this.profileStrength = res.data.strength;
    this.missingSections = res.data.missing || [];
  console.log("profiledata",this.profileStrength)
if(this.profileStrength==0)
{
  this.message="Welcome"
}
if(this.profileStrength>0)
{
  this.message="Welcome back"
}
    //  SAFE CHECK
    if (this.missingSections.length > 0) {
      this.indicator = this.missingSections[0].label;
    } else {
      this.indicator = '';
    }
    this.cdr.detectChanges();

  });

  this.profile.getProfileImageForDashboard().subscribe((res:any) =>{
    this.profileImage = res.profile_image;
    this.role = res.title;
    this.full_name=res.full_name;
   
   
    if (this.profileImage) {
      this.imageUrl = `http://localhost:3000/upload_images/${this.profileImage}`;
    } else {
      this.imageUrl = `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png`; // optional fallback
    }
        this.cdr.detectChanges();

  });


  this.profile.getProfileViews().subscribe((res:any) => {

    this.totalViews = res.data.totalViews;
    this.percentageIncrease = res.data.percentageIncrease;
    
        this.cdr.detectChanges();

  });

 this.profile.getRecruiterMessages().subscribe((res: any) => {

  this.allMessages = res.totalMessages || [];
  this.unreadMessages = res.unreadMessages?.length || 0;
  this.totalMessages = this.allMessages.length;

  this.cdr.detectChanges();
});
   


  this.profile.getAllProjects().subscribe({
    next: (res) => {
        this.allProjects = Array.isArray(res) ? res : [res];                
        this.updateDisplayedProjects();
        this.cdr.detectChanges();
  }
})
}
 
markAsRead(message: any) {
  if (!message.is_read) {
    this.profile.markMessageAsRead(message.id).subscribe(() => {
      message.is_read = 1; // update locally
      this.unreadMessages--;
    });
  }
}

get unreadList() {
  return this.allMessages.filter(m => !m.is_read);
}

get readList() {
  return this.allMessages.filter(m => m.is_read);
}


openMessages() {
  this.selectedTab = 'unread';
  this.showMessageModal = true;
  document.body.classList.add('overflow-hidden');
  this.cdr.detectChanges();
}

closeModal() {
  this.showMessageModal = false;
  document.body.classList.remove('overflow-hidden');
}



updateDisplayedProjects() {
  if (this.showAll) {
    this.displayedProjects = this.allProjects;
  } else {
    this.displayedProjects = this.allProjects.slice(0, 3);
  }
}



toggleAll(){
this.showAll = !this.showAll;
this.updateDisplayedProjects();
}



navigateTo(section: string) {

  switch(section) {
    case 'profile':
      this.router.navigate(['/profile']);
      break;

    case 'education':
      this.router.navigate(['/education']);
      break;

    case 'experience':
      this.router.navigate(['/experience']);
      break;

    case 'projects':
      this.router.navigate(['/project']);
      break;
  }
}

sharePortfolio() {
  const username = localStorage.getItem("username");
  const link = `${window.location.origin}/portfolio/${username}`;
  console.log(link);
  
  navigator.clipboard.writeText(link);
  alert("Link copied!");
}



logout()
{
  localStorage.removeItem("token");
  this.router.navigate(['/auth']);
}

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  

}
