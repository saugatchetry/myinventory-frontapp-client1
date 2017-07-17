import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-drilldownstockreport',
  templateUrl: './drilldownstockreport.component.html',
  styleUrls: ['./drilldownstockreport.component.css']
})
export class DrilldownstockreportComponent implements OnInit {

  public allItemList: any;
  public selectedItem:string;

  public vendorList: any;
  public selectorVendor:string;

  public today:string;

  public priorDate:string;

  public filterStartDate:string = "";
  public filterEndDate:string = "";

  public drillDownDate: any;

  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {

    //Step1 - getAll Item names
    this.fetchAllItems();

    //Step 2- getAll VendorNames
    this.fetchVendorName();

    //set today and prior date

    this.getCurrentDate();
    this.getPriorDate();

  }


  fetchAllItems(){

    this.networkservice.getAllItem()
          .subscribe(

            res => {
              console.log(res);
              this.allItemList = res;
              this.selectedItem = this.allItemList[0];
              console.log("Arrey its "+this.selectedItem);
            });

  }

  fetchVendorName(){

    this.networkservice.getAllVendorsName()
          .subscribe(

            res => {
              console.log(res);
              this.vendorList = res;
              this.selectorVendor = this.vendorList[0].storeName;
            });

  }

  getCurrentDate(){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    this.today = now.getFullYear() + "-" + (month) + "-" + (day);
    console.log("Calculated Date = "+this.today);
  }


  getPriorDate(){
    var d = new Date();
    d.setDate(d.getDate() - 30);
    var day = ("0" + d.getDate()).slice(-2);
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    this.priorDate = d.getFullYear() + "-" + (month) + "-" + (day);
    console.log("Prior Date Calculaed = "+this.priorDate);
  }

  getInventory(){

    // var d = new Date();
    // d.setDate(d.getDate() - 1);
    // var day = ("0" + d.getDate()).slice(-2);
    // var month = ("0" + (d.getMonth() + 1)).slice(-2);
    //
    // this.filterStartDate = d.getFullYear() + "-" + (month) + "-" + (day);
    this.filterStartDate = this.today;
    this.filterEndDate = this.today;

    this.fetchDrillDownReportForVendorAndItem();
  }


  fetchDrillDownReportForVendorAndItem(){

    this.networkservice.getDrillDownReortForVendorAndItem(this.selectorVendor,this.selectedItem,this.filterStartDate,this.filterEndDate)
          .subscribe(

            res => {
              this.drillDownDate = [];
              console.log(res);
              this.drillDownDate = res;

              this.networkservice.currentItemList = res;
              console.log("size of currentInventory = "+this.drillDownDate.length);
              //this.dtTrigger.next();

              // console.log("dtElement = "+this.dtElement);
              //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              //     // Destroy the table first
              //     dtInstance.destroy();
              //     // Call the dtTrigger to rerender again
              //     this.dtTrigger.next();
              //   });
            });

  }

}
