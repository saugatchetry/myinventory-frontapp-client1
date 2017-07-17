import { NetworkService } from './../services/network.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import {ToastsManager, Toast} from 'ng2-toastr';
@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css'],
  providers : [NetworkService]
})
export class AdditemComponent implements OnInit {

  constructor(private networkservice: NetworkService,private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef)
  {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {

  }

  onSubmit(value:any){
    //console.log(value);
    this.sendDataToServer(value);
  }


  sendDataToServer(dataFromForm) {
      console.log("About to send");
      console.log(dataFromForm);
        this.networkservice.sendData(dataFromForm).subscribe(

            response => function(){
              this.okSuccess();
            }, // success
            error => this.okFailed(),       // error
            () => console.log('completed'))   // complete

  }

  okSuccess(){
    console.log("Success Method called");
    this.showSuccess();
  }

  okFailed(){
    console.log("Failed Method called");
    this.showError();
  }

  showSuccess() {
    console.log("toastr method called");
    this.toastr.success('You are awesome!', 'Success!', {toastLife: 3000, showCloseButton: false});
  }

  showError() {
    this.toastr.error('This is not good!', 'Oops!');
  }


}
