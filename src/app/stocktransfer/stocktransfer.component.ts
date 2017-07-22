import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-stocktransfer',
  templateUrl: './stocktransfer.component.html',
  styleUrls: ['./stocktransfer.component.css']
})
export class StocktransferComponent implements OnInit {

  @ViewChild(DataTableDirective) dtElement:DataTableDirective;

  private itemList: any;
  private baseURL:string= "http://localhost:4200/api/addItem";

  private vendorList: any;
  private selectorVendor:string;

  public dateFilterOn = false;

  public filterStartDate:string = "";
  public filterEndDate:string = "";

  public today = new Date().toJSON().split('T')[0];

  public dateString:string;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};



  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) {

  }


  ngOnInit():void {

      var date1 = new Date();
      date1.setDate(date1.getDate() - 90);
      this.dateString = date1.toISOString().split('T')[0];

      //fetch data for today
      this.fetchData();

      this.filterStartDate = this.networkservice.getPriorDate();
      this.filterEndDate = this.networkservice.getTodayDate();

      //get all vendornames

      if(this.networkservice.allVendorNames != null){
          this.vendorList = this.networkservice.allVendorNames;
          this.selectorVendor = this.vendorList[0].storeName;
      }
      else{
        this.fetchVendorName();
      }

  }

  fetchData(){
    this.networkservice.getAllStockTranfersToday(this.today)
          .subscribe(

            res => {
              console.log("Length of response = "+res);
              this.itemList = res;
              this.dtTrigger.next();
            });
  }

  toggleDateFilter(){
     this.dateFilterOn = !this.dateFilterOn;
  }

  fetchVendorName(){

    this.networkservice.getAllVendorsName()
          .subscribe(

            res => {
              console.log(res);
              this.vendorList = res;
              this.networkservice.allVendorNames = this.vendorList;
              this.selectorVendor = this.vendorList[0].storeName;
            });

  }

  submitFilters(){

    var startDate:string = this.dateString;
    var endDate:string = this.today;


    if(this.filterStartDate != '' && this.filterEndDate != ''){
      var d1 = Date.parse(this.filterStartDate);
      var d2 = Date.parse(this.filterEndDate);
      if (d1 > d2) {
          alert("End Date cannot be before Start Date");
      }
      else{
        startDate = this.filterStartDate;
        endDate = this.filterEndDate;
      }
    }

    else if(this.filterStartDate != '' && this.filterEndDate == ''){
        startDate = this.filterStartDate;
        endDate = this.today;
    }

    else if(this.filterStartDate == '' && this.filterEndDate !=''){
      startDate = this.dateString;
      endDate = this.filterEndDate;
    }

    else{
      startDate = this.dateString;
      endDate = this.today;
    }



    this.networkservice.getAllStockTranfersWithFilter(this.selectorVendor,startDate,endDate)
    .subscribe(
        res => {
          this.itemList = [];
          console.log(res);
          this.itemList = res;

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });


          //this.selectorVendor = this.vendorList[0].storeName;
      });;

  }

  DownloadToExcel() {
    var fileName = "Stock_transfer_report.xlsx";
    var data = [];

    var header = ["Date", "Source Vendor", "Target Vendor", "Item Name", "Quantity","Status"];
    data.push(header);

    var store_data = this.itemList.map(function(item) {
      var return_item = [];
      return_item.push(item.date);
      return_item.push(item.sourceVendor);
      return_item.push(item.targetVendor);
      return_item.push(item.itemName);
      return_item.push(item.quantity);
      return_item.push(item.status);
      return return_item;
    });

    data = data.concat(store_data);

    this.networkservice.DownloadToExcel(fileName, data);
  }

}
