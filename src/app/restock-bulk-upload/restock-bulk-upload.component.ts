import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NetworkService } from './../services/network.service';
import {ToastsManager, Toast} from 'ng2-toastr';
import { Observable } from 'rxjs/Observable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-restock-bulk-upload',
  templateUrl: './restock-bulk-upload.component.html',
  styleUrls: ['./restock-bulk-upload.component.css']
})

export class RestockBulkUploadComponent implements OnInit {

  private url:string = "/api/bulkEntry";
  public data:any;
  public header:any;
  public show;
  public path: String;

  constructor(private networkService : NetworkService, 
    private toastr: ToastsManager,vRef: ViewContainerRef) 
  {
    this.toastr.setRootViewContainerRef(vRef);
  }

  ngOnInit() {
    this.path = '';
    this.show = false;
  }


  Submit() {
    this.show = false;
    console.log("Submitting");
    this.networkService.sendBulkRestockData(this.data).subscribe(
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
    console.log(this.path);
    const scope = this;
    scope.show = false;
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        const reader = new FileReader();

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

          //Date Validation
          if(!scope.CheckDateFormatting(data))
          	return;

          scope.data = data.map(function(item) {
            return {
              itemName:scope.networkService.capitalize(item[0]),
              outlet:scope.networkService.capitalize(item[1]),
              quantity:item[2],
              seller:scope.networkService.capitalize(item[3]),
              date:item[4],
            };
          });
          scope.show = true;
        };
        reader.readAsBinaryString(file);
    }
  }

  CheckDateFormatting(data) {
  	var dateReg = /^\d{4}[-]\d{2}[-]\d{2}$/;

  	for(let i in data) {
  		let item = data[i];
      
  		if (!item[4].match(dateReg)) {
  			var error_string = "Date format invalid for " + item[0] + " - Please specify in yyyy-mm-dd format";
  			this.toastr.error(error_string, 'Date Format!', {toastLife: 20000, showCloseButton: true});
  			return false;
  		}
  	}
  	return true;
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

