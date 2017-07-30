import { Component, OnInit, ViewChild } from '@angular/core';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Rx';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-retail-outlets',
  templateUrl: './retail-outlets.component.html',
  styleUrls: ['./retail-outlets.component.css']
})
export class RetailOutletsComponent implements OnInit {
@ViewChild(DataTableDirective) dtElement:DataTableDirective;

	public allVendorsList: any;
  dtTrigger: Subject<any> = new Subject();

  constructor(private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {
  	this.networkservice.getAllVendorsName()
      .subscribe(
        res => {
          this.allVendorsList = res.map(function (item, index) {
          	return {
          		id: index,
          		name: item.storeName
          	};
          });
      });
  }

}
