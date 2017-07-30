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
  public selectedVendor: string;
  public selectedItem: string;
  public storeItemDict;
  public selectedDate;
  public init: false;
  public currentForm;
  public loading;
  

  constructor(private networkservice : NetworkService,private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vRef);
    this.loading = true;
  }

  ngOnInit() {
    // this.fetchVendors();    
    // this.fetchAllItems();
    this.fetchItemAndVendors();
    this.selectedDate = this.fetchToday();
  }

  fetchToday() {
    var now = new Date();
    var month = (now.getMonth() + 1);               
    var day = now.getDate();

    var d = String(day);
    var m = String(month);
    
    if(month < 10) 
        m = "0" + String(month);
    if(day < 10) 
        d = "0" + String(day);

    return String(now.getFullYear()) + '-' + m + '-' + d;
  }

  onVendorChanged(e) {
    this.allItemList = this.storeItemDict[this.selectedVendor];
    
    if(this.allItemList.length > 0) {
      this.selectedItem = this.allItemList[0];
    }
  }

  fetchItemAndVendors() {
    this.networkservice.getAllVendorsName()
      .subscribe(
        res => {
          this.allVendorsList = res.map(function (item) {return item.storeName});
          this.allVendorsList.sort();
          this.selectedVendor = this.allVendorsList[0];

          this.networkservice.getAllItems()
            .subscribe(
              res => {
                this.allItemList = this.processRecords(res);
                if(this.allItemList.length > 0) {
                  this.selectedItem = this.allItemList[0];
                }
                this.loading = false;
            });
    });  
  }

  processRecords(records_list) {
    var tempDict = {} 
    for(var i = 0; i < this.allVendorsList.length; i++) {
      tempDict[this.allVendorsList[i]] = [];
    }

    for(var i = 0; i < records_list.length; i++) {
      var element = records_list[i];
      var current_item = element.itemName;
      // Sanity Check
      if (tempDict[element.outlet] === undefined) {
        tempDict[element.outlet] = [];
      }
      tempDict[element.outlet].push(current_item);
    }

    Object.keys(tempDict).forEach(function(currentKey) {
      tempDict[currentKey].sort();
    });
    this.storeItemDict = tempDict;
    return this.storeItemDict[this.selectedVendor];
  }

  onSubmit(form:any){
    this.loading = true;
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
    this.loading = false;
    this.currentForm.reset();
    this.selectedDate = this.fetchToday();
    this.toastr.success('All resources submitted correctly', 'Success!', {toastLife: 5000, showCloseButton: true});
    console.log("Success");
  }

  okFailed(error){
    this.loading = false;
    let error_string = "";
    let item = error;
    error_string = item["itemName"] + " in " + item["storeName"] + " - " + item["reason"];
    this.toastr.error(error_string, 'Server Submission Error!', {toastLife: 20000, showCloseButton: true});
    
    console.log("Failed");
  }

}
