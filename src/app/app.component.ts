import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { NetworkService } from './services/network.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit,AfterViewChecked{
  title = 'app works!';
  public username : string;
  public isCollapsed: boolean = true;

  constructor(public networkService : NetworkService,public router: Router){
  }
  ngOnInit(){
    
  }

  ngAfterViewChecked(){
      this.username = this.networkService._user;
  }

  myFunc(){
   
  }

  // logoutClick(){
  //   this.networkService._user = "";
  //   this.networkService.isUserLoggedIn = false;
  //   console.log("_user = "+this.networkService._user+" isloggedIn = "+this.networkService.isUserLoggedIn);
  //   this.router.navigate['/login'];
  // }
}
