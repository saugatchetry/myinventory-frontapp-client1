import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { StocktransferComponent } from './../stocktransfer/stocktransfer.component';

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



  constructor(private _http:Http, private networkservice : NetworkService,private router: Router) {
  }


  ngOnInit():void {
    let start = this.networkservice.getPriorDate();
    let end = this.networkservice.getTodayDate();

    this.GetStockAnomaly(start, end);

  }

  onClicked(value){ 
    this.GetStockAnomaly(value.startDate, value.endDate);
  }
 
  toggleDateFilter(){
     this.dateFilterOn = !this.dateFilterOn;
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
