import { NetworkService } from './../services/network.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.css']
})
export class InventoryDetailsComponent implements OnInit {

  private itemHistoryList: any;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};

  constructor(private networkService: NetworkService) {

  }

  ngOnInit() {



      this.getItemHistory();

  }


  getItemHistory(){
    console.log("Working date in layout= "+this.networkService.workingDate);
    console.log("Store Name = "+this.networkService.historyStoreName+" Item Name = "+this.networkService.historyItemName);
    // this.networkService.getHistoryOfItem(this.networkService.historyStoreName,this.networkService.historyItemName)
    //       .subscribe(
    //
    //         res => {
    //           console.log(res);
    //           this.itemHistoryList = res;
    //           this.dtTrigger.next();
    //         });

    this.networkService.getHistoryOfItem(this.networkService.historyStoreName,this.networkService.historyItemName,this.networkService.workingDate)
          .subscribe(

            res => {
              console.log(res);
              this.itemHistoryList = res;
              this.dtTrigger.next();
            });

}

}
