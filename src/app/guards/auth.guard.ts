import { NetworkService } from './../services/network.service';
import { Router,CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private networkservice:NetworkService, private router:Router){

    }

    canActivate(){
        console.log("canActivate called : userLoggedIn = "+this.networkservice.getUserLoggedIn());
        if(this.networkservice.getUserLoggedIn()){
            return true;
        }
        else{
            this.router.navigate(['/login']);
            return false;
        }
    }
}
