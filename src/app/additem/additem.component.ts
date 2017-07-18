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

  public allVendorsList: any;
  public currentForm;

  constructor(private networkservice: NetworkService,private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef)
  {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    if (this.networkservice.allVendorNames === undefined) {
      this.fetchVendors();
    }
    else {
      this.allVendorsList = this.networkservice.allVendorNames;
    }
  }

  fetchVendors() {
    this.networkservice.getAllVendorsName()
      .subscribe(
        res => {
          this.allVendorsList = res.map(function (item) {return item.storeName});
          this.allVendorsList.sort();
          this.networkservice.allVendorNames = this.allVendorsList;
    });
  } 

  onSubmit(form:any){
    this.currentForm = form;
    console.log(form.value);
    this.sendDataToServer(form.value);
  }


  sendDataToServer(dataFromForm) {
      console.log("About to send");
      console.log(dataFromForm);
        this.networkservice.sendData(dataFromForm).subscribe(

            response => function(){
              this.okSuccess();
            }, // success
            error => {
              if (error.status === 400) 
                  this.okFailed(error.json());
              else
                this.showError();
            },       // error
            () => this.okSuccess());   // complete

  }

  okSuccess(){
    console.log("Success Method called");
    this.showSuccess();
  }

  okFailed(error){
    let error_string = "";
    let item = error;
    error_string = item["itemName"] + " in " + item["storeName"] + " - " + item["reason"];
    this.toastr.error(error_string, 'Server Submission Error!', {toastLife: 20000, showCloseButton: true});
    
    console.log("Failed");
  }

  showSuccess() {
    console.log("toastr method called");
    this.currentForm.reset();
    this.toastr.success('Added item to server!', 'Success!', {toastLife: 3000, showCloseButton: false});
  }

  showError() {
    this.toastr.error('Could not add data!', 'Oops!');
  }


}
