import { EditModel } from './../model/edit-receipt-model';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

@Injectable()
export class NetworkService {

  private _url: string = "http://localhost:4200/api/addNewItem";
  private updateReceiptUrl: string = "http://localhost:4200/api/updateReceipts";
  private serverUrl: string;

  //private _url: string = "https://myinventory-test.herokuapp.com/api/addItem";
  //private updateReceiptUrl: string = "https://myinventory-test.herokuapp.com/api/updateReceipts";


  public _user: string;
  public isUserLoggedIn = false;

  public id:number;
  public itemName:String;
  public quantity:String;
  public customerName:String;
  public storeName:String;
  public amount: String;
  public date:String;

  // 
  public editItemName: String;
  public editItemGroup: String;
  public editUOM: String;
  public update;

  public workingDate: String;

  public historyItemName: String;
  public historyStoreName: String;

  public searchStartDate: String;
  public searchEndDate: String;

  public allItems: any;

  public currentItemList: any;
  public allItemsInventoryList: any;

  public allVendorNames: any;
  public allItemList: any;
  public wopts:XLSX.WritingOptions = { bookType:'xlsx', type:'binary' };

  // Caching implemented
  public cache_allVendorResponse;

  constructor(private _http:Http) {
    // this.serverUrl = "https://07c8bd4c.ngrok.io";
    // this.serverUrl = "https://myinventory-test.herokuapp.com"
    this.serverUrl = "https://server.cemnohouse.biz";

    // Initialize Cache
    this.cache_allVendorResponse = null;
    this.update = false;
  }

  //  getAllItems(){
  //    return this._http.get(this.serverUrl + '/api/list').map(data => data.json());
  //    //return this._http.get('https://myinventory-test.herokuapp.com/api/list').map(data => data.json());
  //  }


  getAllUniqueItemNames(){
    return this._http.get(this.serverUrl + '/api/getAllUniqueItemNames').map(
                res => {
                  const data = res.json()
                  //console.log(data);
                  data.sort();
                  this.allItemList = data;
                  return this.allItemList;
              });
  }

  getAllUniqueItemDetails(){
    return this._http.get(this.serverUrl + '/api/getallUniqueItemDetais').map(
                res => {
                  const data = res.json()
                  //console.log(data);
                  return data;
              });
  }
  
	getAllItems(){
	return this._http.get(this.serverUrl + '/api/getAllItems').map(
	        res => {
	          const data = res.json()
	          //console.log(data);
	          return data;
	      });
  }


   getUserLoggedIn(){
     //console.log("network service ... isUserLoggedIn = "+this.isUserLoggedIn);
     return this.isUserLoggedIn;
   }

   setUserLoggedIn(){
     this.isUserLoggedIn = true;
     this._user = "Saugat";
     //console.log("service layer : setUserLoggedIn called .... isUserLoggedIn = "+this.isUserLoggedIn);
   }

   getCurrentDate(){
     var todayTime = new Date();
     var currentDate = todayTime.getDate();
     var currentMonth = todayTime.getMonth()+1;
     var currentYear = todayTime.getFullYear();
     return(currentDate+"/"+currentMonth+"/"+currentYear);
   }

   getAllReceipts(){


    //  let params: URLSearchParams = new URLSearchParams();
    //  params.set('storeName', storeName);
     //
    //  let requestOptions = new RequestOptions();
    //  requestOptions.search = params;

     return this._http.get(this.serverUrl + '/api/getAllReceipts').map(
                res => {
                  const data = res.json()
                  //console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getAllReceipts').map(
      //           res => {
      //             const data = res.json()
      //             //console.log(data);
      //             return data;
      //         });
   }



   getAllReceiptsToday(today:string){


      let params: URLSearchParams = new URLSearchParams();
      params.set('today', today);

      let requestOptions = new RequestOptions();
      requestOptions.search = params;

     return this._http.get(this.serverUrl + '/api/getAllReceiptsToday',requestOptions).map(
                res => {
                  const data = res.json()
                  //console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getAllReceipts',requestOptions).map(
      //           res => {
      //             const data = res.json()
      //             //console.log(data);
      //             return data;
      //         });
   }


   getAllStockTranfersToday(today:string){


      let params: URLSearchParams = new URLSearchParams();
      params.set('today', today);

      let requestOptions = new RequestOptions();
      requestOptions.search = params;

     return this._http.get(this.serverUrl + '/api/getAllStockTranfersToday',requestOptions).map(
                res => {
                  const data = res.json()
                  //console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getAllReceipts',requestOptions).map(
      //           res => {
      //             const data = res.json()
      //             //console.log(data);
      //             return data;
      //         });
   }


   getAllVendorsName(){

     return this._http.get(this.serverUrl + '/api/getAllVendors').map(
                res => {
                  const data = res.json();
                  this.allVendorNames = data;
                  this.allVendorNames.sort();
                  return this.allVendorNames;
              });

   }

   getReceiptsWithFilter(vendorName:string,startDate:string,endDate:string){
     //console.log("service + vendorName = "+vendorName+" startDate = "+startDate+" endDate = "+endDate);
     var selectedStartDate : string;
     var selectedEndDate : string;

     if(startDate == undefined || endDate == undefined){
       selectedStartDate = '';
       selectedEndDate = '';
     }
     else{
       selectedStartDate = startDate;
       selectedEndDate = endDate;
     }

     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', vendorName);
     params.set('startDate', selectedStartDate);
     params.set('endDate', selectedEndDate)

     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     //console.log(" service layer vendorName = "+vendorName+" startDate = "+selectedStartDate+" endDate = "+selectedEndDate);

     return this._http.get(this.serverUrl + '/api/getAllReceiptsWithFilters',requestOptions).map(data => data.json());

   }

   getAllStockTranfersWithFilter(vendorName:string,startDate:string,endDate:string){
     //console.log("service + vendorName = "+vendorName+" startDate = "+startDate+" endDate = "+endDate);
     var selectedStartDate : string;
     var selectedEndDate : string;

     if(startDate == undefined || endDate == undefined){
       selectedStartDate = '';
       selectedEndDate = '';
     }
     else{
       selectedStartDate = startDate;
       selectedEndDate = endDate;
     }

     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', vendorName);
     params.set('startDate', selectedStartDate);
     params.set('endDate', selectedEndDate)

     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     //console.log(" service layer sourceVendor = "+vendorName+" startDate = "+selectedStartDate+" endDate = "+selectedEndDate);

     return this._http.get(this.serverUrl + '/api/getAllStockTransfersFilters',requestOptions).map(data => data.json());

   }

   getAllFailedOutGoingStockTransfers(startDate:string,endDate:string) {
    
     var selectedStartDate : string;
     var selectedEndDate : string;

     if(startDate == undefined || endDate == undefined){
       selectedStartDate = '';
       selectedEndDate = '';
     }
     else{
       selectedStartDate = startDate;
       selectedEndDate = endDate;
     }

     let params: URLSearchParams = new URLSearchParams();
     params.set('startDate', selectedStartDate);
     params.set('endDate', selectedEndDate)

     let requestOptions = new RequestOptions();
     requestOptions.search = params;
  

     return this._http.get(this.serverUrl + '/api/getAllFailedOutGoingStockTransfers',requestOptions).map(data => data.json());
   }
   
   getDrillDownReport(storeName, itemName, startDate, endDate) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('storeName', storeName);
    params.set('itemName', itemName);
    params.set('startDate', startDate);
    params.set('endDate', endDate);

    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http.get(this.serverUrl + '/api/getDrillDownReortForVendorAndItem',requestOptions).map(data => data.json());
   }

   getAllStockTranfers(){
      return this._http.get(this.serverUrl + '/api/getEveryStockTransfers').map(
                res => {
                  const data = res.json()
                  //console.log(data);
                  return data;
              });
   }

   sendBulkData(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("encoded_data = " + encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.serverUrl + "/api/bulkEntry", encoded_data, options).map(
            (res: Response) => res.json() || {}
        );

   }

  sendNewItemName(itemDetails): Observable<Object> {

    let params: URLSearchParams = new URLSearchParams();  
    for (var key in itemDetails) {
      params.set(key, itemDetails[key]);
    }

    let requestOptions = new RequestOptions();
    requestOptions.search = params;
    return this._http.get(this.serverUrl + '/api/renameItem',requestOptions).map(data => data.json());
  }

   sendFailedOutGoingStockTransfer(data): Observable<Object> {
     let encoded_data = JSON.stringify(data);
      //console.log("encoded_data = " + encoded_data);
      let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
      let options = new RequestOptions({ headers: headers });
      return this._http.post(this.serverUrl + "/api/pushFailedOutGoingStockTransfer", encoded_data, options).map(
          (res: Response) => res.json() || {}
      );
   } 

   sendBulkRestockData(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("encoded_data = " + encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.serverUrl + "/api/bulkRestock", encoded_data, options).map(
            (res: Response) => res.json() || {}
        );

   }

   sendData(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("Network Service");
        //console.log("encoded_data = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.serverUrl + "/api/addNewItem", encoded_data, options)/*.map(
            (res: Response) => res.json() || {}
        )*/;

   }

   sendRestockData(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("Network Service");
        //console.log("encoded_data = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.serverUrl + "/api/refillItemInInventory", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }

   sendUpdatedReceipt(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("Network Service");
        //console.log("encoded_data for receipt update = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.serverUrl + "/api/updateReceipts", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }

   sendResetPassword(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("Network Service");
        //console.log("encoded_data for receipt update = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.serverUrl + "/api/resetPassword", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }

   sendLoginRequest(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        //console.log("Network Service");
        //console.log("encoded_data for receipt update = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.serverUrl + "/api/loginRequest", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }



   setItemToEdit(id:number,customerName:string,itemName:string,quantity:string,storeName:string,amount:string,date:string){
      this.id = id;
      this.itemName = itemName;
      this.quantity = quantity;
      this.customerName = customerName;
      this.storeName = storeName;
      this.amount = amount;
      this.date = date;
     //console.log("Set Item called name = "+this.itemName+" value = "+this.quantity+" id = "+this.id);

   }


   getCurrentInventoryOfVendors(storeName){
     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', storeName);

     let requestOptions = new RequestOptions();
     requestOptions.search = params;

     return this._http.get(this.serverUrl + '/api/getCurrentInventoryOfVendor',requestOptions).map(data => data.json());
   }


   getCurrentInventoryOfItem(itemName){
     let params: URLSearchParams = new URLSearchParams();
     params.set('itemName', itemName);

     let requestOptions = new RequestOptions();
     requestOptions.search = params;

     return this._http.get(this.serverUrl + '/api/getCurrentInventoryOfItem',requestOptions).map(data => data.json());
   }


  //   getHistoryOfItem(storeName,itemName){
  //    let params: URLSearchParams = new URLSearchParams();
  //    params.set('storeName', storeName);
  //    params.set('itemName', itemName);
  //
  //    let requestOptions = new RequestOptions();
  //    requestOptions.search = params;
   //
  //    return this._http.get(this.serverUrl + '/api/getItemHistory',requestOptions).map(data => data.json());
  //  }

   getHistoryOfItem(storeName,itemName,date){
    let params: URLSearchParams = new URLSearchParams();
    params.set('storeName', storeName);
    params.set('itemName', itemName);
    params.set('date',date);
    let requestOptions = new RequestOptions();
    requestOptions.search = params;

    return this._http.get(this.serverUrl + '/api/getItemHistory',requestOptions).map(data => data.json());
  }

   getItemToEdit(){

   }


   getAllRestockInventoryData(){
     return this._http.get(this.serverUrl + '/api/getAllRestockInventoryData').map(
               res => {
                 const data = res.json()
                 //console.log(data);
                 return data;
             });
   }

   getCurrentInventoryOfVendorsWithFilters(storeName:string,startDate:string,endDate:string){
     //console.log("storeName = "+storeName+" startDate = "+startDate+" endDate = "+endDate);
     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', storeName);
     params.set('startDate', startDate );
     params.set('endDate', endDate);
     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     return this._http.get(this.serverUrl + '/api/getCurrentInventoryOfVendorsWithFilters',requestOptions).map(data => data.json());
   }

   getCurrentInventoryOfItemWithFilters(itemName:string,startDate:string,endDate:string){
     //console.log("storeName = "+itemName+" startDate = "+startDate+" endDate = "+endDate);
     let params: URLSearchParams = new URLSearchParams();
     params.set('itemName', itemName);
     params.set('startDate', startDate );
     params.set('endDate', endDate);
     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     return this._http.get(this.serverUrl + '/api/getCurrentInventoryOfItemWithFilters',requestOptions).map(data => data.json());
   }

   getDrillDownReortForVendorAndItem(storeName:string,itemName:string,startDate:string,endDate:string){
     //console.log("storeName = "+itemName+" startDate = "+startDate+" endDate = "+endDate);
     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', storeName);
     params.set('itemName', itemName);
     params.set('startDate', startDate );
     params.set('endDate', endDate);
     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     return this._http.get(this.serverUrl + '/api/getDrillDownReortForVendorAndItem',requestOptions).map(data => data.json());
   }

   // util

  capitalize(item) {
    if (typeof(item) ===  'string')
      return item;
      //return item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
    else
      return item;
  }

  getTodayDate(){
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    return now.getFullYear() + "-" + (month) + "-" + (day);
  }


  getPriorDate(){
    var d = new Date();
    d.setDate(d.getDate() - 1);
    var day = ("0" + d.getDate()).slice(-2);
    var month = ("0" + (d.getMonth() + 1)).slice(-2);
    return d.getFullYear() + "-" + (month) + "-" + (day);
  }

  DownloadToExcel(fileName, data) {
      /* generate worksheet */
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    /* generate workbook and add the worksheet */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    const wbout = XLSX.write(wb, this.wopts);
    saveAs(new Blob([this.s2ab(wbout)]), fileName);
  }

  s2ab(s:string):ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF;
    };
    return buf;
  }


}
