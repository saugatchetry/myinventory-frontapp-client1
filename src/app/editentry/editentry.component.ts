import { EditModel } from './../model/edit-receipt-model';
import { Component, OnInit, ElementRef, ViewChild  } from '@angular/core';
import { EditReceiptComponentComponent } from './../edit-receipt-component/edit-receipt-component.component';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';


@Component({
  selector: 'app-editentry',
  templateUrl: './editentry.component.html',
  styleUrls: ['./editentry.component.css'],
})

export class EditentryComponent implements OnInit {
@ViewChild(DataTableDirective) dtElement:DataTableDirective;
@ViewChild('something') something:ElementRef;

  public itemList: any;

  private vendorList: any;
  public selectorVendor:string;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  public download_fileName = "editentry";
  public excel_data;

  public dateFilterOn = false;

  public filterStartDate:string = "";
  public filterEndDate:string = "";

  //public today = new Date().toJSON().split('T')[0];
  public today:string;

  public priorDate:string;

  public vendorNameArray = ["Select"];

  constructor(private _http:Http, private networkservice : NetworkService,private router: Router, public modal: Modal) {
  }

  ngOnInit():void {



    // this.getCurrentDate();
    // this.getPriorDate();

    this.priorDate = this.filterStartDate = this.networkservice.getPriorDate();
    this.today = this.filterEndDate = this.networkservice.getTodayDate();



    if(this.vendorList == null){
      console.log("vendorlist is empty .... gettting it please wait");
      this.fetchVendorName();
    }
    else{
      console.log("vendorlist is not empty ");
      console.log(this.vendorList);
    }

    this.fetchData();
  }

  ngAfterViewInit(): void {
      //this.dtTrigger.next();

    //this.dtElement = this.myTable;
  }


  getItems(id){
      console.log("Clicked = "+id);
      var iName = id.itemName;
      var q = id.quantity;
      this.networkservice.setItemToEdit(id.id,id.customerName,id.itemName,id.quantity,id.receiptOutletName,id.amount,id.date);
      //this.router.navigate(['/editreceipt']);
      this.modal.open(EditReceiptComponentComponent, overlayConfigFactory({}, BSModalContext))
        .then(dialog => dialog.result)
        .then(result => this.submitFilters());
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

  fetchData(){

    console.log("About to call api with today = "+this.today);

    this.networkservice.getAllReceiptsToday(this.today)
      .subscribe(

        res => {
          console.log(res);
          const scope = this;
          this.itemList = res;
          this.itemList = this.itemList.map(function(item) {
            item.edit = (scope.getDateDiff(item.date, scope.today) > 30) ? false : true;
            return item;
          });
          this.dtTrigger.next();
        });
  }

  fetchVendorName(){

    this.networkservice.getAllVendorsName()
          .subscribe(

            res => {
              console.log("fetchVendorName response is - "+res);
              this.vendorList = res;
              console.log("Length of response = "+res.length);

              for(var i = 0; i < res.length; i++){
                  this.vendorNameArray.push(this.vendorList[i].storeName);
              }
              console.log("Vendorname is - "+this.vendorList);

              this.networkservice.allVendorNames = this.vendorList;
              //this.selectorVendor = this.vendorList[0].storeName;
              this.selectorVendor = this.vendorNameArray[0];
              this.showData();
            });

  }

  showData(){
    console.log("Show Data");
    console.log(this.itemList);
    for(var i = 0; i < 5; i++){
        console.log("Experiment = "+this.vendorNameArray[i]);
    }
  }

  toggleDateFilter(){
     this.dateFilterOn = !this.dateFilterOn;
  }

  submitFilters(){

    var startDate:string = this.priorDate;
    var endDate:string = this.today;

    //var startDate = this.filterStartDate.split('-').reverse().join('/');
    //var endDate = this.filterEndDate.split('-').reverse().join('/');
    //console.log("selectorVendor = "+this.selectorVendor+" StartDate = "+startDate+" EndDate = "+endDate);
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
          this.makeTheApiCall(this.selectorVendor,startDate,endDate);
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
          this.makeTheApiCall(this.selectorVendor,startDate,endDate);
        }

    }

    else if(this.filterStartDate == '' && this.filterEndDate !=''){
      startDate = this.priorDate;
      endDate = this.filterEndDate;

      var dateNew = new Date(endDate);
      dateNew.setDate(dateNew.getDate() - 30);
      //console.log("Abhi Kya karenge - "+dateNew.toISOString().split('T')[0]);
      startDate = dateNew.toISOString().split('T')[0];

      this.makeTheApiCall(this.selectorVendor,startDate,endDate);
    }

    else{
      startDate = this.priorDate;
      endDate = this.today;
      this.makeTheApiCall(this.selectorVendor,startDate,endDate);
    }
  }

  getDateDiff(start, end) {
    var d1 = Date.parse(start);
    var d2 = Date.parse(end);
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var date_diff = (d2-d1)/ONE_DAY;
    return date_diff;
  }


  makeTheApiCall(storeName:string,startDate:string,endDate:string){
    console.log("StoreName filter = "+storeName);
    console.log("StartDate filter = "+startDate);
    console.log("EndDate filter = "+endDate);

    this.networkservice.getReceiptsWithFilter(this.selectorVendor,startDate,endDate)
    .subscribe(
        res => {
          this.itemList = [];
          console.log(res);
          this.itemList = res;
          const scope = this;
          this.itemList = this.itemList.map(function(item) {
            item.edit = (scope.getDateDiff(item.date, scope.today) > 30) ? false : true;
            return item;
          });

          this.itemList.sort(function(a, b) {
            return a.id - b.id;
          });

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          // Destroy the table first
          dtInstance.destroy();
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
        });
        //this.selectorVendor = this.vendorList[0].storeName;
      });
  }

  DownloadToExcel() {
    var fileName = "Daily_Sales_Report" + "__" + this.filterStartDate + "--" + this.filterEndDate+ ".xlsx";;
    var data = [];

    var header = ["Date", "Store Name", "Customer name","Item Name", "Quantity", "Amount"];
    data.push(header);

    var store_data = this.itemList.map(function(item) {
      var return_item = [];
      return_item.push(item.date);
      return_item.push(item.receiptOutletName);
      return_item.push(item.customerName);
      return_item.push(item.itemName);
      return_item.push(item.quantity);
      return_item.push(item.amount);
      return return_item;
    });

    data = data.concat(store_data);

    this.networkservice.DownloadToExcel(fileName, data);
  }

}
