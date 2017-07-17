import { AuthGuard } from './guards/auth.guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule , JsonpModule} from '@angular/http';
import { routes } from './app.router';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { AdditemComponent } from './additem/additem.component';
import { EditentryComponent } from './editentry/editentry.component';
import { SavereportComponent } from './savereport/savereport.component';
import { LoginComponent } from './login/login.component';
import { DataTablesModule } from 'angular-datatables';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { Ng2UploaderModule } from 'ng2-uploader';
import { EditReceiptComponentComponent } from './edit-receipt-component/edit-receipt-component.component';
import { NetworkService } from './services/network.service';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { VendorwiseInventoryStatusComponent } from './vendorwise-inventory-status/vendorwise-inventory-status.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { RestockitemComponent } from './restockitem/restockitem.component';
import { ItemwiseInventoryStatusComponent } from './itemwise-inventory-status/itemwise-inventory-status.component';
import { LogoutComponent } from './logout/logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToastModule, ToastOptions } from 'ng2-toastr';
import { CustomOption } from './custom-option';
import { InventoryAdditionReportComponent } from './inventory-addition-report/inventory-addition-report.component';
import { DrilldownstockreportComponent } from './drilldownstockreport/drilldownstockreport.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    AdditemComponent,
    EditentryComponent,
    SavereportComponent,
    LoginComponent,
    FileuploadComponent,
    EditReceiptComponentComponent,
    StocktransferComponent,
    VendorwiseInventoryStatusComponent,
    LoadingIndicatorComponent,
    InventoryDetailsComponent,
    RestockitemComponent,
    ItemwiseInventoryStatusComponent,
    LogoutComponent,
    ResetPasswordComponent,
    InventoryAdditionReportComponent,
    DrilldownstockreportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    DataTablesModule,
    Ng2UploaderModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    routes
  ],
  providers: [NetworkService,AuthGuard,{provide: ToastOptions, useClass: CustomOption}],
  bootstrap: [AppComponent]
})
export class AppModule { }