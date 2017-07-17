import { Component, OnInit } from '@angular/core';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  
})
export class LoginComponent implements OnInit {

  constructor(private networkservice : NetworkService, private router: Router) { 

  }

  ngOnInit() {
  }

  onSubmit(value:any){
    console.log("user = "+value.username+" password = "+value.password);
    // if(value.username == "Saugat" && value.password == "apple"){
    //   // this.networkservice._user = "Saugat";
    //   // this.router.navigate(['/additem']);
    //   this.networkservice.setUserLoggedIn();
    //   this.router.navigate(['/additem']);
      
    // }
    // else{
    //   alert("Username or Password did not match !!!");
    // }
    
    this.sendDataToServer(value);
    
  }

  sendDataToServer(dataFromForm) {
      
        this.networkservice.sendLoginRequest(dataFromForm).subscribe(

             response => this.okLoginDone(), // success
             error => alert("Incorrect UserName or Password"),       // error
             () => console.log('completed'));   // complete

  }

  okLoginDone(){
    this.networkservice.setUserLoggedIn();
    this.router.navigate(['/editentry']);
  }

}
