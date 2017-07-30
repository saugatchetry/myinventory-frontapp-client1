import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Rx';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-dd-stock-report',
  templateUrl: './dd-stock-report.component.html',
  styleUrls: ['./dd-stock-report.component.css']
})
export class DdStockReportComponent implements OnInit, AfterViewInit {
@ViewChild(DataTableDirective) dtElement:DataTableDirective;

  public allItemList: any;
  public allItemDetailsList: any;
  public allVendorsList: any;
  public selectedItem: string;
  public selectedItemDetails: any;
  public selectedVendor: string;
  public transactions: any;
  public opening: string;
  public closing: string;
  public dateFrom: string;
  public dateTo: string;
  public show: any;
  public openingDate:string = "";
  public closingDate:string = "";

  public dateFilterOn = false;
  public filterStartDate:string = "";
  public filterEndDate:string = "";
  public today:string;
  public priorDate:string;
  public transactionCount;
  public storeItemDict;

  dtTrigger: Subject<any> = new Subject();
  
  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {
    this.fetchItemAndVendors();
    this.show = false;
    this.transactionCount = 0;
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
    this.priorDate = this.filterStartDate = this.networkservice.getPriorDate();
    this.today = this.filterEndDate = this.networkservice.getTodayDate();
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
            });
    });  
  }

  processRecords(records_list) {
    var tempDict = {} 
    for(var i = 0; i < this.allVendorsList.length; i++) {
      tempDict[this.allVendorsList[i]] = [];
    }

    this.allItemDetailsList = {};
    for(var i = 0; i < records_list.length; i++) {
      var element = records_list[i];
      var current_item = element.itemName;
      this.allItemDetailsList[current_item] = element;
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

  getReport(vendor, item, startDate, endDate) {

    this.openingDate = startDate;
    this.closingDate = endDate;
    this.selectedItemDetails = this.allItemDetailsList[item];
  	this.networkservice.getDrillDownReport(vendor, item, startDate, endDate)
  		.subscribe(res => {
  			this.show = false;
        this.transactions = [];
        if (res.length > 0) {
          this.show = true;
          this.updateReport(res);
  				this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
            // Call the dtTrigger to rerender again
            this.dtTrigger.next();
          });
  				
        }
  		});
  }

  updateReport(res_list) {

  	var closing = res_list[0].opening; // saugat laziness
		var opening = closing;

    res_list.sort(function(a, b) {
      let val = (b.date < a.date) ? true : false;
      return val;
    });

		for(var i = 0; i < res_list.length; i++) {
			var trans_type = res_list[i].type;
			var quantity = res_list[i].quantity;
			var date = res_list[i].date;
			opening = this.updateOpeningBalance(trans_type, quantity, opening);

			var trans_item = {
        id: i+1,
        date: date,
				type: trans_type,
				quantity: quantity
			}
			this.transactions.push(trans_item);
		}
    this.opening = opening;
    this.closing = closing;
    this.transactionCount = res_list.length + 1;

  }

  updateOpeningBalance(trans_type, quantity, current_balance) {
  	switch(trans_type) {
  		case 'Restock Inventory':
  			current_balance -= quantity;
  			break;
			case 'Stock Received':
				current_balance -= quantity;
  			break;
			case 'Stock Transfered':
				current_balance += quantity;
  			break;
			case 'Item Sale':
				current_balance += quantity;
  			break;
			default:
				console.error("Unknown trans_type found" + trans_type);
				break;
		}
		return current_balance;
  }

  getEmptyTransItem() {
    return {
      date: "",
      store: "",
      itemName: "",
      itemGroup: "",
      uom: "",
      type: "",
      quantity: 0
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
          this.getReport(this.selectedVendor, this.selectedItem, startDate, endDate);
          // this.makeTheApiCall(this.selectorVendor,startDate,endDate);
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
          this.getReport(this.selectedVendor, this.selectedItem, startDate, endDate);
          // this.makeTheApiCall(this.selectorVendor,startDate,endDate);
        }

    }

    else if(this.filterStartDate == '' && this.filterEndDate !=''){
      startDate = this.priorDate;
      endDate = this.filterEndDate;

      var dateNew = new Date(endDate);
      dateNew.setDate(dateNew.getDate() - 30);
      //console.log("Abhi Kya karenge - "+dateNew.toISOString().split('T')[0]);
      startDate = dateNew.toISOString().split('T')[0];
      this.getReport(this.selectedVendor, this.selectedItem, startDate, endDate);
    }

    else{
      startDate = this.priorDate;
      endDate = this.today;
      this.getReport(this.selectedVendor, this.selectedItem, startDate, endDate);
    }
  }

  DownloadToExcel() {
    if(this.transactions === undefined)
      return;

    var fileName = this.selectedVendor + "_" + this.selectedItem + "_drill_down_stock_report" +"__" + this.filterStartDate + "--" + this.filterEndDate+ ".xlsx";
    var data = [];

    var header = ["Date", "Retail Outlet", "Item Name", "Item Group", "UOM", "Nature", "Quantity"];
    data.push(header);
    header = [this.openingDate, "", "", "", "","Opening", this.opening];
    data.push(header);
    const scope = this;

    for(var i = 0; i < this.transactions.length; i++) {
      var item = this.transactions[i];
      var return_item = [];
      return_item.push(item.date);
      return_item.push(scope.selectedVendor);
      return_item.push(scope.selectedItemDetails.itemName);
      return_item.push(scope.selectedItemDetails.itemGroup);
      return_item.push(scope.selectedItemDetails.uom);
      return_item.push(item.type);
      return_item.push(item.quantity);
      data.push(return_item);
    };

    header = [this.closingDate, "", "", "", "","Closing", this.closing];
    data.push(header);

    this.networkservice.DownloadToExcel(fileName, data);
  }
}
