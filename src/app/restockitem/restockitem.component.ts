import { Response } from '@angular/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import {ToastsManager, Toast} from 'ng2-toastr';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restockitem',
  templateUrl: './restockitem.component.html',
  styleUrls: ['./restockitem.component.css']
})
export class RestockitemComponent implements OnInit {

  public allVendorsList: any;
  public allItemList: any;
  public selectedVendor: String;
  public selectedItem: String;
  public init: false;
  public currentForm;
  

  constructor(private networkservice : NetworkService,private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.fetchVendors();    
    this.fetchAllItems();
  }

  fetchVendors(){
    if (this.networkservice.allVendorNames === undefined) {
      this.networkservice.getAllVendorsName()
            .subscribe(
              res => {
                console.log(res);
                this.allVendorsList = res;
                this.selectedVendor = this.allVendorsList[0].storeName;
              });
    }   
    else {
      this.allVendorsList = this.networkservice.allVendorNames;
    }  

    this.allVendorsList = this.allVendorsList.map(function(item) {
      return item.storeName;
    });  
  }

  fetchAllItems() {
    if (this.networkservice.allItemList === undefined) {
      this.networkservice.getAllUniqueItemNames()
            .subscribe(
              res => {
                console.log(res);
                this.allItemList = res;
                this.selectedItem = this.allItemList[0].storeName;
              });
    }   
    else {
      this.allItemList = this.networkservice.allItemList;
    }    
  }


  onSubmit(form:any){
    this.currentForm = form;
    this.sendDataToServer(form.value);
  }

  sendDataToServer(dataFromForm) {
    for (var key in dataFromForm) {
      dataFromForm[key] = this.networkservice.capitalize(dataFromForm[key])
    }

    console.log("About to send");
    console.log(dataFromForm);
      this.networkservice.sendRestockData(dataFromForm).subscribe(
        response => function(){
          this.okSuccess();
        }, // success
        error => {
          if (error.status === 400) 
              this.okFailed(error.json());
          else
            this.toastr.error(error, 'Server Submission Error!', {toastLife: 5000, showCloseButton: true});
        },
        () => this.okSuccess());   // complete;
  }

  okSuccess(){
    this.currentForm.reset();
    this.toastr.success('All resources submitted correctly', 'Success!', {toastLife: 5000, showCloseButton: true});
    console.log("Success");
  }

  okFailed(error){
    let error_string = "";
    let item = error;
    error_string = item["itemName"] + " in " + item["storeName"] + " - " + item["reason"];
    this.toastr.error(error_string, 'Server Submission Error!', {toastLife: 20000, showCloseButton: true});
    
    console.log("Failed");
  }

}
