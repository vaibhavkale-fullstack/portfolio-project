import { CanActivateFn, Router } from '@angular/router';
import { PortfolioService } from '../AllServices/portfolio';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
   
  const portFolio = inject(PortfolioService);
  const router = inject(Router);

  if(portFolio.isLoggedIn()){
    return true;
  }else{
    router.navigate(['/login'])
    return false;
  }

};
