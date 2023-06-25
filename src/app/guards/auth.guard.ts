import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(private accountServer:AccountService,private router:Router) {
    
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{
    return this.accountServer.constructor$.pipe(
      map(auth=>{
        if(auth){
          return true;
        }else{
          this.router.navigate([''],{queryParams:{returnUrl:state.url}})
          return false;
        }
      })
    );
  }
  
}
