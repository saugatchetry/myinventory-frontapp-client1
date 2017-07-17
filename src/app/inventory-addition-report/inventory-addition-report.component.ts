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

}
