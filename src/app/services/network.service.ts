import { EditModel } from './../model/edit-receipt-model';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { DatePipe } from '@angular/common';

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

  public workingDate: String;

  public historyItemName: String;
  public historyStoreName: String;

  public searchStartDate: String;
  public searchEndDate: String;

  public allItems: any;

  public currentItemList: any;
  public allItemsInventoryList: any;

  public allVendorNames: any;

  constructor(private _http:Http) {
    // this.serverUrl = "https://6ccd8ae4.ngrok.io";
    this.serverUrl = "https://myinventory-test.herokuapp.com"
  }

  //  getAllItems(){
  //    return this._http.get(this.serverUrl + '/api/list').map(data => data.json());
  //    //return this._http.get('https://myinventory-test.herokuapp.com/api/list').map(data => data.json());
  //  }


  getAllUniqueItemNames(){
    return this._http.get(this.serverUrl + '/api/getAllUniqueItemNames').map(
                res => {
                  const data = res.json()
                  console.log(data);
                  return data;
              });
  }

  getAllUniqueItemDetails(){
    return this._http.get(this.serverUrl + '/api/getallUniqueItemDetais').map(
                res => {
                  const data = res.json()
                  console.log(data);
                  return data;
              });
  }
  
	getAllItems(){
	return this._http.get(this.serverUrl + '/api/getAllItems').map(
	        res => {
	          const data = res.json()
	          console.log(data);
	          return data;
	      });
  }


   getUserLoggedIn(){
     console.log("network service ... isUserLoggedIn = "+this.isUserLoggedIn);
     return this.isUserLoggedIn;
   }

   setUserLoggedIn(){
     this.isUserLoggedIn = true;
     this._user = "Saugat";
     console.log("service layer : setUserLoggedIn called .... isUserLoggedIn = "+this.isUserLoggedIn);
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
                  console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getAllReceipts').map(
      //           res => {
      //             const data = res.json()
      //             console.log(data);
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
                  console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getAllReceipts',requestOptions).map(
      //           res => {
      //             const data = res.json()
      //             console.log(data);
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
                  console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getAllReceipts',requestOptions).map(
      //           res => {
      //             const data = res.json()
      //             console.log(data);
      //             return data;
      //         });
   }


   getAllVendorsName(){

     return this._http.get(this.serverUrl + '/api/getAllVendors').map(
                res => {

                  const data = res.json();
                  return data;
              });

   }


   getReceiptsWithFilter(vendorName:string,startDate:string,endDate:string){
     console.log("service + vendorName = "+vendorName+" startDate = "+startDate+" endDate = "+endDate);
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
     console.log(" service layer vendorName = "+vendorName+" startDate = "+selectedStartDate+" endDate = "+selectedEndDate);

     return this._http.get(this.serverUrl + '/api/getAllReceiptsWithFilters',requestOptions).map(data => data.json());

   }

   getAllStockTranfersWithFilter(vendorName:string,startDate:string,endDate:string){
     console.log("service + vendorName = "+vendorName+" startDate = "+startDate+" endDate = "+endDate);
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
     console.log(" service layer sourceVendor = "+vendorName+" startDate = "+selectedStartDate+" endDate = "+selectedEndDate);

     return this._http.get(this.serverUrl + '/api/getAllStockTransfersFilters',requestOptions).map(data => data.json());

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
                  console.log(data);
                  return data;
              });

      // return this._http.get('https://myinventory-test.herokuapp.com/api/getEveryStockTransfers').map(
      //           res => {
      //             const data = res.json()
      //             console.log(data);
      //             return data;
      //         });
   }

   sendData(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        console.log("Network Service");
        console.log("encoded_data = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.serverUrl + "/api/addNewItem", encoded_data, options)/*.map(
            (res: Response) => res.json() || {}
        )*/;

   }

   sendRestockData(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        console.log("Network Service");
        console.log("encoded_data = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });
        return this._http.post(this.serverUrl + "/api/refillItemInInventory", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }

   sendUpdatedReceipt(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        console.log("Network Service");
        console.log("encoded_data for receipt update = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.serverUrl + "/api/updateReceipts", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }

   sendResetPassword(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        console.log("Network Service");
        console.log("encoded_data for receipt update = "+encoded_data);
        let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(this.serverUrl + "/api/resetPassword", encoded_data, options)/*.map(
             (res: Response) => res.json() || {}
         )*/;

   }

   sendLoginRequest(data): Observable<Object> {

        let encoded_data = JSON.stringify(data);
        console.log("Network Service");
        console.log("encoded_data for receipt update = "+encoded_data);
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
     console.log("Set Item called name = "+this.itemName+" value = "+this.quantity+" id = "+this.id);

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
                 console.log(data);
                 return data;
             });
   }

   getCurrentInventoryOfVendorsWithFilters(storeName:string,startDate:string,endDate:string){
     console.log("storeName = "+storeName+" startDate = "+startDate+" endDate = "+endDate);
     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', storeName);
     params.set('startDate', startDate );
     params.set('endDate', endDate);
     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     return this._http.get(this.serverUrl + '/api/getCurrentInventoryOfVendorsWithFilters',requestOptions).map(data => data.json());
   }


   getCurrentInventoryOfItemWithFilters(itemName:string,startDate:string,endDate:string){
     console.log("storeName = "+itemName+" startDate = "+startDate+" endDate = "+endDate);
     let params: URLSearchParams = new URLSearchParams();
     params.set('itemName', itemName);
     params.set('startDate', startDate );
     params.set('endDate', endDate);
     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     return this._http.get(this.serverUrl + '/api/getCurrentInventoryOfItemWithFilters',requestOptions).map(data => data.json());
   }

   getDrillDownReortForVendorAndItem(storeName:string,itemName:string,startDate:string,endDate:string){
     console.log("storeName = "+itemName+" startDate = "+startDate+" endDate = "+endDate);
     let params: URLSearchParams = new URLSearchParams();
     params.set('storeName', storeName);
     params.set('itemName', itemName);
     params.set('startDate', startDate );
     params.set('endDate', endDate);
     let requestOptions = new RequestOptions();
     requestOptions.search = params;
     return this._http.get(this.serverUrl + '/api/getDrillDownReortForVendorAndItem',requestOptions).map(data => data.json());
   }



}
