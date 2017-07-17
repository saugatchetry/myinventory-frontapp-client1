import { Component, OnInit } from '@angular/core';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private networkservice : NetworkService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(value:any){

    this.sendDataToServer(value);

    // if(value.newpassword == value.confirmpassword) {
    //   this.sendDataToServer(value);
    // } 
    // else{
    //   alert("Passwords Donot Match");
    // }
    
  }

  sendDataToServer(dataFromForm) {
      
        this.networkservice.sendResetPassword(dataFromForm).subscribe(

             response => alert("Password Updated Successfully"), // success
             error => alert("Failed To update Password"),       // error
             () => console.log('completed'));   // complete

  }

}
