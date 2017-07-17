import { EditModel } from './../model/edit-receipt-model';
import { Component, OnInit } from '@angular/core';
import { NetworkService } from './../services/network.service';

@Component({
  selector: 'app-edit-receipt-component',
  templateUrl: './edit-receipt-component.component.html',
  styleUrls: ['./edit-receipt-component.component.css'],
  //providers : [NetworkService]

})
export class EditReceiptComponentComponent implements OnInit {

  public id:number;
  public itemName:String;
  public quantity:String;
  public customerName: String;
  public receiptOutletName: String;
  public amount: String;
  public date: String;

  private editModel:EditModel;
  constructor(private networkservice : NetworkService) { 
    
  }

  ngOnInit() {
    
    console.log("Item name = "+this.networkservice.itemName+" item id = "+this.networkservice.id);
    this.id = this.networkservice.id;
    this.itemName = this.networkservice.itemName;
    this.customerName = this.networkservice.customerName;
    this.quantity = this.networkservice.quantity;
    this.receiptOutletName = this.networkservice.storeName;
    this.amount = this.networkservice.amount;
    this.date = this.networkservice.date;
  }


   afterSave(value:any){
     console.log("Changed = ");
     this.sendDataToServer(value);
   }


   


  sendDataToServer(dataFromForm) {
      console.log("About to send");
      console.log(dataFromForm);
        this.networkservice.sendUpdatedReceipt(dataFromForm).subscribe(

             response => console.log(response), // success
             error => console.log(error),       // error
             () => console.log('completed'));   // complete

  }
}
