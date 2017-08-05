import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NetworkService } from './../services/network.service';
import {ToastsManager, Toast} from 'ng2-toastr';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-edit-item-name',
  templateUrl: './edit-item-name.component.html',
  styleUrls: ['./edit-item-name.component.css']
})

export class EditItemNameComponent implements OnInit, ModalComponent<BSModalContext> {

  public uom:String;
  public itemName:String;
  public itemGroup:String;
  public oldItemName:String;
  
  private context: BSModalContext;
  constructor(private networkservice : NetworkService, private toastr: ToastsManager,vRef: ViewContainerRef, public dialog: DialogRef<BSModalContext>) { 
    this.toastr.setRootViewContainerRef(vRef);
    this.context = dialog.context;
  }

  ngOnInit() {
    this.itemName = this.networkservice.editItemName;
    this.itemGroup = this.networkservice.editItemGroup;
    this.uom = this.networkservice.editUOM;
    this.networkservice.update = false;
  }

  afterSave(form){
     console.log("Changed = ");
     var json = form.value;
     json["oldItemName"] = this.networkservice.editItemName;
     this.sendDataToServer(json);
   }

  sendDataToServer(json) {
    console.log(json);
    this.networkservice.sendNewItemName(json).subscribe(
      response => this.showSuccess(), // success
      error => this.showError(),       // error
      () => this.showSuccess());   // complete
  }

  cancel() {
    this.dialog.close();
  }
  
  showSuccess() {
    this.networkservice.update = true;
    this.toastr.success('Item updated!', 'Success!', {toastLife: 3000, showCloseButton: false});
    this.dialog.close();
    
  }

  showError() {
    this.toastr.error('Could not edit receipt', 'Error!', {toastLife: 20000, showCloseButton: true});
  }


}
