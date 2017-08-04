import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';
import {ToastsManager, Toast} from 'ng2-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  public login_requested;
  constructor(private networkservice : NetworkService, private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef) { 
    this.login_requested = false;
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
  }

  onSubmit(value:any){
    //console.log("user = "+value.username+" password = "+value.password);
    // if(value.username == "Saugat" && value.password == "apple"){
    //   // this.networkservice._user = "Saugat";
    //   // this.router.navigate(['/additem']);
    //   this.networkservice.setUserLoggedIn();
    //   this.router.navigate(['/additem']);
      
    // }
    // else{
    //   alert("Username or Password did not match !!!");
    // }
    this.login_requested = true;
    this.sendDataToServer(value);
  }

  sendDataToServer(dataFromForm) {
      
        this.networkservice.sendLoginRequest(dataFromForm).subscribe(

             response => this.okLoginDone(), // success
             error => this.showError(error),       // error
             () => console.log('completed'));   // complete

  }

  okLoginDone(){
    this.login_requested = false;
    this.networkservice.setUserLoggedIn();
    this.router.navigate(['/editentry']);
  }

  showError(error) {
    //console.log(error.status);
    if (error.status === 400) 
      this.toastr.error("Check your password", 'Authentication Failed', {toastLife: 5000, showCloseButton: true});
    else
      this.toastr.warning("Check your internet", 'Cant connect to server', {toastLife: 5000, showCloseButton: true});
    this.login_requested = false;
  }

}
