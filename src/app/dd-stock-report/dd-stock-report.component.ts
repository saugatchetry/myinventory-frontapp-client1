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
  public allVendorsList: any;
  public selectedItem: string;
  public selectedVendor: string;
  public transactions: any;
  public opening: string;
  public closing: string;
  public dateFrom: string;
  public dateTo: string;
  public show: any;

  dtTrigger: Subject<any> = new Subject();
  
  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {
  	this.fetchItemAndVendors();
    this.show = false;
  }

  ngAfterViewInit(): void {
      this.dtTrigger.next();
  }

	fetchItemAndVendors() {
    this.networkservice.getAllVendorsName()
      .subscribe(
        res => {
          this.allVendorsList = res.map(function (item) {return item.storeName});
          this.allVendorsList.sort();
          this.selectedVendor = this.allVendorsList[0];
    });

  	this.networkservice.getAllUniqueItemNames()
          .subscribe(
            res => {
            	res.sort();
              this.allItemList = res;
              this.selectedItem = this.allItemList[0];
    });
  }

  getReport() {

  	this.networkservice.getDrillDownReport(this.selectedVendor, this.selectedItem, '2017-07-15', '2017-07-15')
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

  	var opening = res_list[0].opening;
		var closing = opening;
		for(var i = 0; i < res_list.length; i++) {
			var trans_type = res_list[i].type;
			var quantity = res_list[i].quantity;
			var date = res_list[i].date;
			closing = this.updateClosingBalance(trans_type, quantity, closing);

			var trans_item = {
				date: date,
				type: trans_type,
				quantity: quantity
			}
			this.transactions.push(trans_item);
		}
    this.opening = opening;
    this.closing = closing;
  }

  updateClosingBalance(trans_type, quantity, current_balance) {
  	switch(trans_type) {
  		case 'Restock Inventory':
  			current_balance += quantity;
  			break;
			case 'Stock Received':
				current_balance += quantity;
  			break;
			case 'Stock Transferred':
				current_balance -= quantity;
  			break;
			case 'Item Sale':
				current_balance -= quantity;
  			break;
			default:
				console.error("Unknown trans_type found" + trans_type);
				break;
		}
		return current_balance;
  }
}
