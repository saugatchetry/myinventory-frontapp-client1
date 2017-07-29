import { EditModel } from './../model/edit-receipt-model';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NetworkService } from './../services/network.service';
import {ToastsManager, Toast} from 'ng2-toastr';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-edit-receipt-component',
  templateUrl: './edit-receipt-component.component.html',
  styleUrls: ['./edit-receipt-component.component.css'],
  //providers : [NetworkService]

})

export class EditReceiptComponentComponent implements OnInit, ModalComponent<BSModalContext> {


  public id:number;
  public itemName:String;
  public quantity:String;
  public customerName: String;
  public receiptOutletName: String;
  public amount: String;
  public date: String;
  public currentForm;


  private editModel:EditModel;
  private context: BSModalContext;
  constructor(private networkservice : NetworkService, private toastr: ToastsManager,vRef: ViewContainerRef, public dialog: DialogRef<BSModalContext>) { 
    this.toastr.setRootViewContainerRef(vRef);
    this.context = dialog.context;
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

  sendDataToServer(form) {
      this.currentForm = form;
      let dataFromForm = form.value;
      console.log("About to send");
      console.log(dataFromForm);
        this.networkservice.sendUpdatedReceipt(dataFromForm).subscribe(

             response => function(){
              this.showSuccess();
            }, // success
            error => {
              this.showError();
            },       // error
            () => this.showSuccess());   // complete
  }

  cancel() {
    this.dialog.close();
  }
  
  showSuccess() {
    console.log("toastr method called");
    this.dialog.close();
    this.currentForm.reset();
    this.toastr.success('Receipt editted!', 'Success!', {toastLife: 3000, showCloseButton: false});
  }

  showError() {
    this.toastr.error('Could not edit receipt', 'Error!', {toastLife: 20000, showCloseButton: true});
  }
}
