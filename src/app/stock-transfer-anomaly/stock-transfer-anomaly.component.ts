import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-transfer-anomaly',
  templateUrl: './stock-transfer-anomaly.component.html',
  styleUrls: ['./stock-transfer-anomaly.component.css']
})
export class StockTransferAnomalyComponent implements OnInit {

    @ViewChild(DataTableDirective) dtElement:DataTableDirective;

  private itemList: any;
  
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
      //this.fetchData();
  }

 

  toggleDateFilter(){
     this.dateFilterOn = !this.dateFilterOn;
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



    this.networkservice.getAllFailedOutGoingStockTransfers("Saugat",startDate,endDate)
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
