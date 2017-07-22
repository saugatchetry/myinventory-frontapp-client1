import { Component, OnInit, ViewChild, Input, AfterViewInit, ViewContainerRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { StocktransferComponent } from './../stocktransfer/stocktransfer.component';
import {ToastsManager, Toast} from 'ng2-toastr';

@Component({
  selector: 'app-stock-transfer-anomaly',
  templateUrl: './stock-transfer-anomaly.component.html',
  styleUrls: ['./stock-transfer-anomaly.component.css'],
})

export class StockTransferAnomalyComponent implements OnInit {
    @ViewChild(DataTableDirective) dtElement:DataTableDirective;

  private itemList: any;
  
  public dateFilterOn = false;
  public filterStartDate:string = "";
  public filterEndDate:string = "";
  public today = new Date().toJSON().split('T')[0];
  public dateString:string;

  @Input() data_in:{};

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};



  constructor(private _http:Http, private networkservice : NetworkService,private router: Router,
              private toastr: ToastsManager,vRef: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit():void {
    let start = this.networkservice.getPriorDate();
    let end = this.networkservice.getTodayDate();

    this.GetStockAnomaly(start, end);

  }

  ngAfterViewInit(): void {
      this.dtTrigger.next();

    //this.dtElement = this.myTable;
  }

  onClicked(value){ 
    this.GetStockAnomaly(value.startDate, value.endDate);
  }

  DownloadToExcel() {
    var fileName = "Stock_transfer_anomaly.xlsx";
    var data = [];

    var header = ["Date", "Source Vendor", "Target Vendor", "Item Name", "Quantity","Status","Reason"];
    data.push(header);

    var store_data = this.itemList.map(function(item) {
      var return_item = [];
      return_item.push(item.date);
      return_item.push(item.sourceVendor);
      return_item.push(item.targetVendor);
      return_item.push(item.itemName);
      return_item.push(item.quantity);
      return_item.push(item.status);
      return_item.push(item.reason);
      return return_item;
    });

    data = data.concat(store_data);

    this.networkservice.DownloadToExcel(fileName, data);
  }
 
  retry(transfer) {
    this.networkservice.sendFailedOutGoingStockTransfer(transfer)
    .subscribe(
        response => function(){
              this.okSuccess(transfer);
            }, // success
            error => {
              if (error.status === 400) 
                  this.okFailed(error.json());
              else
                this.showError();
            },       // error
            () => this.okSuccess(transfer));   // complete

  }

  okSuccess(transfer){
    console.log("Success Method called");

    for (var i = 0; i < this.itemList.length; i++) {
      if (transfer.transferId === this.itemList[i].transferId) {
        this.itemList.splice(i,1);
      }
    }
    this.showSuccess();
  }

  okFailed(error){
    let error_string = "";
    let item = error;
    error_string = item["reason"];
    this.toastr.error(error_string, 'Server Submission Error!', {toastLife: 20000, showCloseButton: true});
    
    console.log("Failed");
  }

  showSuccess() {
    console.log("toastr method called");
    this.toastr.success('Added item to server!', 'Success!', {toastLife: 3000, showCloseButton: false});
  }

  showError() {
    this.toastr.error('Could not add data!', 'Oops!');
  }

  GetStockAnomaly(startDate, endDate){
    this.networkservice.getAllFailedOutGoingStockTransfers(startDate,endDate)
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
          })
        },
        error => {
          let code = error.json();
        },       // error
        () => {
          let code = 2;
        });
  }


}
