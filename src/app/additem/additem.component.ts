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
  public allItemsList: any;
  public allItemGroups: any;
  public allItemUOM: any;
  public currentForm;
  public selectedVendor;

  constructor(private networkservice: NetworkService,private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef)
  {
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
                this.allVendorsList = res;
                this.selectedVendor = this.allVendorsList[0].storeName;
                this.allVendorsList = this.allVendorsList.map(function(item) {
                  return item.storeName;
                });
              });
    }   
    else {
      this.allVendorsList = this.networkservice.allVendorNames;
      this.selectedVendor = this.allVendorsList[0].storeName;
      this.allVendorsList = this.allVendorsList.map(function(item) {
        return item.storeName;
      });
    }        
  } 

  fetchAllItems() {
    this.networkservice.getAllUniqueItemDetails()
      .subscribe(
        res => {
          let uom = {};
          let groups = {};
          let items = []
          for (let index = 0; index < res.length; index++) {
            let item = res[index];
            items.push(item[0]);  
            groups[item[1]] = 1;
            uom[item[2]] = 1;
          }
          this.allItemUOM = Object.keys(uom);
          this.allItemGroups = Object.keys(groups);
          this.allItemsList = items;
        });
  }

  onSubmit(form:any){
    this.currentForm = form;
    this.sendDataToServer(form.value);
  }


  sendDataToServer(dataFromForm) {
      for (var key in dataFromForm) {
        dataFromForm[key] = this.networkservice.capitalize(dataFromForm[key])
      }

      dataFromForm.quantity = 0;
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
    this.showSuccess();
  }

  okFailed(error){
    let error_string = "";
    let item = error;
    error_string = item["itemName"] + " in " + item["storeName"] + " - " + item["reason"];
    this.toastr.error(error_string, 'Server Submission Error!', {toastLife: 20000, showCloseButton: true});
    
    ////console.log("Failed");
  }

  showSuccess() {
    //console.log("toastr method called");
    this.currentForm.reset();
    this.toastr.success('Added item to server!', 'Success!', {toastLife: 3000, showCloseButton: false});
  }

  showError() {
    this.toastr.error('Could not add data!', 'Oops!');
  }


}
