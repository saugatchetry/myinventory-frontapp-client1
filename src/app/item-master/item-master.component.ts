import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { Http } from '@angular/http';
import { NetworkService } from './../services/network.service';
import { Subject } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { EditItemNameComponent } from './../edit-item-name/edit-item-name.component';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Overlay, overlayConfigFactory } from 'angular2-modal';

@Component({
  selector: 'app-item-master',
  templateUrl: './item-master.component.html',
  styleUrls: ['./item-master.component.css']
})
export class ItemMasterComponent implements OnInit {
@ViewChild(DataTableDirective) dtElement:DataTableDirective;

  public allItemList: any;
  public allVendorsList: any;
  dtTrigger: Subject<any> = new Subject();

  private currentItemIndex;

  constructor(private _http:Http, private networkservice : NetworkService,private router: Router, private modal: Modal) { }

  ngOnInit() {
    this.fetchDetails();
  }

  fetchDetails() {
    this.networkservice.getAllVendorsName()
      .subscribe(
        res => {
          this.allVendorsList = res.map(function (item) {return item.storeName});
          this.networkservice.getAllItems()
          .subscribe(
            res => {
              this.allItemList = this.processRecords(res);
              this.dtTrigger.next();
          });
      });
  }

  processRecords(records_list) {
    var tempDict = {} 
    var storeDefaultArray = [];
    
    for(var i = 0; i < this.allVendorsList.length; i++)
      storeDefaultArray.push("No");

    for(var i = 0; i < records_list.length; i++) {
      var element = records_list[i];
      var current_item = tempDict[element.itemName];
      
      if (current_item === undefined) {
        current_item = {
          'itemName': element.itemName,
          'itemGroup': element.itemGroup,
          'uom': element.uom,
          'stores': JSON.parse(JSON.stringify(storeDefaultArray)) // deep copy
        }
      }

      var storeIndex = this.allVendorsList.indexOf(element.outlet);
      current_item.stores[storeIndex] = "Yes";
      tempDict[element.itemName] = current_item;
    }

    var return_array = Object.keys(tempDict).map(function(key, i){
      var val = tempDict[key];
      val["index"] = i;
      return val;
    });

    return return_array;
  }

  editItem(oldItem) {
    this.networkservice.editItemName = oldItem.itemName;
    this.networkservice.editItemGroup =oldItem.itemGroup;
    this.networkservice.editUOM = oldItem.uom;

    this.modal.open(EditItemNameComponent, overlayConfigFactory({}, BSModalContext))
        .then(dialog => dialog.result)
        .then(result => this.updateItem(result));

    // this.networkservice.editItemName(oldItemName, "Tomato").subscribe(
    //   res => {
    //     this.okSuccess();
    //   });
  }

  updateItem(response) {
    if(!this.networkservice.update) return;
    
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
    });

    this.fetchDetails();
    
  }

  okSuccess(){
    console.log("success");
  }

  okFailed(){
    console.log("error");
    
    ////console.log("Failed");
  }


  DownloadToExcel() {
    var fileName = "Item_master.xlsx";
    var data = [];

    var header = ["Item Name", "Item Group", "UOM"];
    header = header.concat(this.allVendorsList);
    data.push(header);
    
    for(var i = 0; i < this.allItemList.length; i++) {
      var return_item = [];
      var item = this.allItemList[i];
      var stores = item.stores;
      return_item.push(item.itemName);
      return_item.push(item.itemGroup);
      return_item.push(item.uom);
      for(var j = 0; j < stores.length; j++) {
        return_item.push(stores[j]);
      }
      data.push(return_item);
    }
    this.networkservice.DownloadToExcel(fileName, data);
  }
}
