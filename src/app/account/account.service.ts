import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/models/user';
import { environment } from 'src/enviroments/enviroments';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl=environment.baseUrl;
  private currentUserSource=new BehaviorSubject<User|null>(null);
  constructor$=this.currentUserSource.asObservable();
  constructor(private http:HttpClient,private router:Router) { }
  register(values:any){
    return this.http.post<User>(this.baseUrl+"account/register",values).pipe(
      map(user=>{
       this.currentUserSource.next(user);
      })
    )
  }

  login(values:any){
    return this.http.post<User>(this.baseUrl+"account/login",values).pipe(
      map(user=>{
        localStorage.setItem("token",user.token);
       this.currentUserSource.next(user);
      })
    )
  }

  logout(){
    localStorage.removeItem("token");
    this.currentUserSource.next(null);
  }
  checkEmailExists(email:string){
    return this.http.get<boolean>(this.baseUrl+"account/checkEmail?email="+email);
  }
}
