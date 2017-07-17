import { Response } from '@angular/http';
import { Component, OnInit } from '@angular/core';
import { NetworkService } from './../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restockitem',
  templateUrl: './restockitem.component.html',
  styleUrls: ['./restockitem.component.css']
})
export class RestockitemComponent implements OnInit {

  public vendorNames: any;
  public selectedVendor: String;

  constructor(private networkservice : NetworkService,private router: Router) { }

  ngOnInit() {

    this.getAllVendorNames();


  }


  getAllVendorNames(){
    this.networkservice.getAllVendorsName()
          .subscribe(

            res => {
              console.log(res);
              this.vendorNames = res;
              this.selectedVendor = this.vendorNames[0].storeName;
            });
  }


  onSubmit(value:any){
    //console.log("Date entered = "+value.date);
    //value.date = value.date.split('-').reverse().join('/');
    //console.log("Date reformatted = "+value.date);
    this.sendDataToServer(value);
  }

  sendDataToServer(dataFromForm) {
      console.log("About to send");
      console.log(dataFromForm);
        this.networkservice.sendRestockData(dataFromForm).subscribe(

            response => console.log(response), // success
            error => alert("Failed to Insert Record"),       // error
            () => console.log('completed'))   // complete

  }

}
