import { Component, OnInit } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-addition-report',
  templateUrl: './inventory-addition-report.component.html',
  styleUrls: ['./inventory-addition-report.component.css']
})
export class InventoryAdditionReportComponent implements OnInit {

  dtTrigger: Subject<any> = new Subject();

  public itemHistoryList: any;

  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {

      this.fetchData();
    }

    fetchData(){
      this.networkservice.getAllRestockInventoryData()
                    .subscribe(

                      res => {
                        console.log(res);
                        this.itemHistoryList = res;
                        this.dtTrigger.next();
                      });
    }

  DownloadToExcel() {
    var fileName = "Inventory_Addition_report.xlsx";
    var data = [];

    var header = ["Date", "Retail Outlet", "Name of Vendor", "Item Name","Quantity"];
    data.push(header);

    var store_data = this.itemHistoryList.map(function(item) {
      var return_item = [];
      return_item.push(item.date);
      return_item.push(item.outlet);
      return_item.push(item.seller);
      return_item.push(item.itemName);
      return_item.push(item.quantity);
      return return_item;
    });

    data = data.concat(store_data);

    this.networkservice.DownloadToExcel(fileName, data);
  }

}
