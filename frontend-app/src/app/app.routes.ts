import { Routes } from '@angular/router';
import { About } from './about/about';
import { Skills } from './skills/skills';
import { Projects } from './projects/projects';
import { Contact } from './contact/contact';
import { Landing } from './landing/landing';


import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './guard/auth-guard';
import { AuthComponent } from './auth-component/auth-component';
import { Profile } from './profile/profile';
import { Experience } from './experience/experience';
import { Education } from './education/education';
import { Projectform } from './projects/projectform/projectform';
import { Portfolio } from './portfolio/portfolio';


export const routes: Routes = [

    {path: '', component: Landing },
    {path:'auth', component:AuthComponent},
    {path:'about', component:About},
    {path:'skills', component:Skills},
    {path:'project', component:Projects},
    {path:'contact', component:Contact},
    {path:'dashboard', component:Dashboard,canActivate:[authGuard]},
    {path:'profile', component:Profile},
    {path:'experience', component:Experience},
    {path:'education', component:Education},
    {path:'projectform/:id', component:Projectform},
    {path:'portfolio-preview', component:Portfolio},
    {path:'portfolio/:username',component:Portfolio}
   
];
