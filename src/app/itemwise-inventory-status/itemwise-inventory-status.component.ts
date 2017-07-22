import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-itemwise-inventory-status',
  templateUrl: './itemwise-inventory-status.component.html',
  styleUrls: ['./itemwise-inventory-status.component.css']
})
export class ItemwiseInventoryStatusComponent implements OnInit,AfterViewInit {
@ViewChild(DataTableDirective) dtElement:DataTableDirective;

  public allItemList: any;
  public selectedItem:string;

  public itemCurrentInventory: any;

  public dateFilterOn = false;

  public filterStartDate:string = "";
  public filterEndDate:string = "";

  dtTrigger: Subject<any> = new Subject();

  dtOptions: DataTables.Settings = {};
  public loading;

  public today:string;

  public priorDate:string;


  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {

    this.priorDate = this.filterStartDate = this.networkservice.getPriorDate();
    this.today = this.filterEndDate = this.networkservice.getTodayDate();
    this.loading = false;

    if(this.allItemList == null){
      console.log("vendorlist is empty .... gettting it please wait");
      this.fetchAllItems();
    }
    else{
      console.log("vendorlist is not empty ");
      console.log(this.allItemList);
    }


    if(this.networkservice.allItemsInventoryList != null){
      console.log("I still have data - size = "+this.networkservice.allItemsInventoryList.length);
      this.itemCurrentInventory = this.networkservice.allItemsInventoryList;
      this.dtTrigger.next();
    }
  }

  ngAfterViewInit(): void {
      this.dtTrigger.next();

    //this.dtElement = this.myTable;
  }


  fetchAllItems(){

    this.networkservice.getAllUniqueItemNames()
          .subscribe(

            res => {
              console.log(res);
              this.allItemList = res;
              this.selectedItem = this.allItemList[0];
              console.log("Arrey its "+this.selectedItem);
            });

  }


  fetchCurrentInventoryOfVendor(){
    
    this.networkservice.getCurrentInventoryOfItem(this.selectedItem)
          .subscribe(

            res => {
              this.itemCurrentInventory = [];
              console.log(res);
              this.itemCurrentInventory = res;
              //this.loading = false;

              this.networkservice.allItemsInventoryList = res;
              console.log("size of currentInventory = "+this.itemCurrentInventory.length);
              //this.dtTrigger.next();

              console.log("dtElement = "+this.dtElement);
                  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  // Destroy the table first
                  dtInstance.destroy();
                  // Call the dtTrigger to rerender again
                  this.dtTrigger.next();
                });
            });

  }


  getInventory(){
      console.log("name = "+this.selectedItem);
      this.fetchCurrentInventoryOfVendor();
  }


  getInventoryDetails(itm){
      this.networkservice.historyStoreName = itm.outlet;
      this.networkservice.historyItemName = itm.itemName;

      if(itm.date == undefined){
        //console.log("vendor dates = "+this.today);
        this.networkservice.workingDate = this.today;
      }
      else{
        //console.log("vendor dates = "+itm.date);
        this.networkservice.workingDate = itm.date;
      }
      
      this.router.navigate(['/inventorydetails']);
    }

  toggleDateFilter(){
     this.dateFilterOn = !this.dateFilterOn;
  }

  submitFilters(){

    var startDate:string = this.priorDate;
    var endDate:string = this.today;

    if(this.filterStartDate != '' && this.filterEndDate != ''){
      var d1 = Date.parse(this.filterStartDate);
      var d2 = Date.parse(this.filterEndDate);
      if (d1 > d2) {
          alert("End Date cannot be before Start Date");
      }
      else{
        var ONE_DAY = 1000 * 60 * 60 * 24
        var date_diff = (d2-d1)/ONE_DAY;

        if(date_diff > 90){
          alert("Date cannot be greater than 90 days");
        }
        else{
          startDate = this.filterStartDate;
          endDate = this.filterEndDate;
          this.makeTheApiCall(this.selectedItem,startDate,endDate);
        }
      }
    }

    else if(this.filterStartDate != '' && this.filterEndDate == ''){
        startDate = this.filterStartDate;
        endDate = this.today;
        var d1 = Date.parse(startDate);
        var d2 = Date.parse(endDate);
        var ONE_DAY = 1000 * 60 * 60 * 24
        var date_diff = (d2-d1)/ONE_DAY;
        if(date_diff > 90){
          alert("Date cannot be greater than 90 days");
        }
        else{
          this.makeTheApiCall(this.selectedItem,startDate,endDate);
        }

    }

    else if(this.filterStartDate == '' && this.filterEndDate !=''){
      startDate = this.priorDate;
      endDate = this.filterEndDate;

      var dateNew = new Date(endDate);
      dateNew.setDate(dateNew.getDate() - 30);
      //console.log("Abhi Kya karenge - "+dateNew.toISOString().split('T')[0]);
      startDate = dateNew.toISOString().split('T')[0];

      this.makeTheApiCall(this.selectedItem,startDate,endDate);
    }

    else{
      startDate = this.priorDate;
      endDate = this.today;
      this.makeTheApiCall(this.selectedItem,startDate,endDate);
    }


  }

  makeTheApiCall(name:string,startDate:string,endDate:string){
    this.loading = true;
    this.networkservice.getCurrentInventoryOfItemWithFilters(name,startDate,endDate)
          .subscribe(

            res => {
              this.itemCurrentInventory = [];
              console.log(res);
              this.itemCurrentInventory = res;
              //console.log("Where is date = "+this.itemCurrentInventory[0].date);
              this.networkservice.currentItemList = res;
              console.log("size of currentInventory = "+this.itemCurrentInventory.length);
              //this.dtTrigger.next();
              this.loading = false;
              console.log("dtElement = "+this.dtElement);
                  this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                  // Destroy the table first
                  dtInstance.destroy();
                  // Call the dtTrigger to rerender again
                  this.dtTrigger.next();
                });
            });
  }

  DownloadToExcel() {
    var fileName = this.selectedItem + "_item_wise_inventory"+ "__" + this.filterStartDate + "--" + this.filterEndDate+ ".xlsx";
    var data = [];

    var header = ["Date", "Item Name", "Item Group", "Store Name", "Quantity"];
    data.push(header);

    var store_data = this.itemCurrentInventory.map(function(item) {
      var return_item = [];
      return_item.push(item.date);
      return_item.push(item.itemName);
      return_item.push(item.itemGroup);
      return_item.push(item.outlet);
      return_item.push(item.quantity);
      return return_item;
    });

    data = data.concat(store_data);

    this.networkservice.DownloadToExcel(fileName, data);
  }
}
