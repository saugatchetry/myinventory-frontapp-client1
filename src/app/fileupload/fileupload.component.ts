import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NetworkService } from './../services/network.service';
import {ToastsManager, Toast} from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  private url:string = "/api/bulkEntry";
  public data:any;
  public duplicates;
  public header:any;
  public show;
  constructor(private networkService : NetworkService, 
    private toastr: ToastsManager,vRef: ViewContainerRef) 
  {
    this.duplicates = [];
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.show = false;
  }


  Submit() {
    this.show = false;
    console.log("Submitting");
    this.networkService.sendBulkData(this.data).subscribe(
      response => function(){
        this.okSuccess();
      }, // success
      error => {
        if (error.status === 400) 
            this.okFailed(error.json());
        else
          this.toastr.error(error, 'Server Submission Error!', {toastLife: 5000, showCloseButton: true});
      },
      () => this.okSuccess());   // complete;
  }

  fileChange(event) {
    const scope = this;
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        const reader = new FileReader();

        this.duplicates = [];

        reader.onload = function (e:any) {
          /* read workbook */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, {type:'binary'});

          /* grab first sheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];

          // /* save data to scope */
          const data = (XLSX.utils.sheet_to_json(ws, {header:1}));
          scope.header = data[0];
          data.splice(0,1);

          scope.data = data.map(function(item) {
            return {
              itemName:scope.networkService.capitalize(item[0]),
              itemGroup:scope.networkService.capitalize(item[1]),
              outlet:scope.networkService.capitalize(item[2]),
              uom:scope.networkService.capitalize(item[3])
            };
          });

          // Checking duplicates
          var separator = " #$%^&*&$#$%^ ";
          var seen = {}
          var duplicates = scope.data.filter(function(item) {
            var key = item.itemName + separator + item.outlet;
            if (seen.hasOwnProperty(key)) {
              return true;
            }
            seen[key] = item;
            return false;
          });
          scope.duplicates = duplicates;
          scope.show = true;
        };
        reader.readAsBinaryString(file);
    }
  }

  okSuccess(){
    this.toastr.success('All resources submitted correctly', 'Success!', {toastLife: 5000, showCloseButton: true});
    console.log("Success");
  }

  okFailed(error){
    let error_string = "";
    for(var i = 0; i < error.length; i++) {
      let item = error[i];
      error_string = item["itemName"] + " in " + item["storeName"] + " - " + item["reason"];
      this.toastr.error(error_string, 'Server Submission Error!', {toastLife: 20000, showCloseButton: true});
    }
    console.log("Failed");
    
  }
}
