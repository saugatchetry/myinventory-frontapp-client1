import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NetworkService } from '../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, AfterViewInit {

  constructor(public networkService : NetworkService,public router: Router) { 

  }

  ngOnInit() {
      
  }

  ngAfterViewInit(): void {
     console.log("log out component"); 
     this.networkService._user = undefined;
     this.networkService.isUserLoggedIn = false;
     this.router.navigate(['/login']);
     
  }

}
