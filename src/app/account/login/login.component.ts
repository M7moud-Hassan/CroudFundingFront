import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  implements AfterViewInit,OnInit {
  formErrors: any;
  returnUrl:string="";
  loginForm=new FormGroup(
    {
      email:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required,Validators.minLength(8)])
    }
    
  )
  registerForm=new FormGroup({
    firstName:new FormControl('',Validators.required),
    lastName:new FormControl('',Validators.required),
    email:new FormControl('',[Validators.required,Validators.email]),
    phone:new FormControl ('',[Validators.required,this.egyptianPhoneNumberValidator()]),
    password:new FormControl('',[Validators.required,this.passwordValidator()]),
    image:new FormControl(null,Validators.required)
  })
  constructor(private accountService:AccountService,private activateRoute:ActivatedRoute,
    private notification:NotificationService) {

    this.returnUrl=this.activateRoute.snapshot.queryParams['returnUrl']|| "/";
  }
  ngOnInit(): void {
   
  }
  onSubmit(){
   if(this.loginForm.valid){
    this.accountService.login(this.loginForm.value).subscribe({
      next:(user)=>console.log(user)
      
    })
   }
    else{
      if(this.loginForm.controls.email.errors?.['required']){
        this.notification.showError("the email is required","error email");    
       }
       if(this.loginForm.controls.email.errors?.['email']){
        this.notification.showError("type your email in correct format","error email");    
       }
       if(this.loginForm.controls.password.errors?.['required']){
        this.notification.showError("password is Required","error pasasword");    
       }else{
      
       
       if(this.loginForm.controls.password.errors){
        this.notification.showError("minLength of password should be greate than 8","error password");    
       }
      }
    }
  }
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.registerForm.patchValue({
        image: file
      });
    }
  }

  RegisterUser(){
    if(this.registerForm.valid){
      const formData = new FormData();
      formData.append("FirstName",this.registerForm.controls.firstName.value||"");
      formData.append("LastName",this.registerForm.controls.lastName.value||"");
      formData.append("phone",this.registerForm.controls.phone.value||"");
      formData.append("imageFile",this.registerForm.controls.image.value||"");
      formData.append("Email",this.registerForm.controls.email.value||"");
      formData.append("Password",this.registerForm.controls.password.value||"");  
     this.accountService.register(formData).subscribe({
      next:(user)=>{
       this.notification.showSuccess("check your email to validation ","Regiteration Done")
       this.registerForm.reset();
      }
     })
    }else{
     if(this.registerForm.controls.email.errors?.['required']){
      this.notification.showError("the email is required","error email");    
     }
     if(this.registerForm.controls.email.errors?.['email']){
      this.notification.showError("type your email in correct format","error email");    
     }
     if(this.registerForm.controls.firstName.errors?.['required']){
      this.notification.showError("the firstName is required","error firstName");    
     }
     if(this.registerForm.controls.lastName.errors?.['required']){
      this.notification.showError("the lastName is required","error lastName");    
     }
     if(this.registerForm.controls.phone.errors?.['required']){
      this.notification.showError("the phone is required","error phone");    
     }
     if(this.registerForm.controls.password.errors?.['required']){
      this.notification.showError("the password is required","error password");    
     }
     if(this.registerForm.controls.image.errors?.['required']){
      this.notification.showError("the image is required","error image");    
     }
    console.log(this.registerForm.controls.password.errors);
    
    }
    
  }
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.value;
     
      

      // At least one uppercase letter
      const uppercaseRegex = /(?=.*[A-Z])/;
      if (!uppercaseRegex.test(password)) {
        return { uppercase: true };
      }

      // At least one number
      const numberRegex = /(?=.*\d)/;
      if (!numberRegex.test(password)) {
        return { number: true };
      }

      // At least one special character
      const specialCharRegex = /(?=.*[!@#$%^&*])/;
      if (!specialCharRegex.test(password)) {
        return { specialChar: true };
      }

      // Minimum length of 8 characters
      if (password.length < 8) {
        return { minLength: true };
      }

      return null;
    };
  }
  egyptianPhoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const phoneNumber = control.value;

      // Regular expression for Egyptian phone number format
      const phoneRegex = /^(?:\+?20)?(?:\(0\))?(?:1[0125]\d{8}|(?:2[0124567]|3[01234569]|4[012345689]|5[01234567]|6[0123456]|8[01234569])[0123456789]\d{6})$/;

      if (!phoneRegex.test(phoneNumber)) {
        return { egyptianPhoneNumber: true };
      }

      return null;
    };
  }
  ngAfterViewInit(): void {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    
    signUpButton!.addEventListener('click', () => {
      container!.classList.add("right-panel-active");
    });
    
    signInButton!.addEventListener('click', () => {
      container!.classList.remove("right-panel-active");
    });
  }

}
