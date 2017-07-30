import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';
import { DdStockReportComponent } from './dd-stock-report/dd-stock-report.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { ItemwiseInventoryStatusComponent } from './itemwise-inventory-status/itemwise-inventory-status.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { RestockitemComponent } from './restockitem/restockitem.component';
import { RestockBulkUploadComponent } from './restock-bulk-upload/restock-bulk-upload.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { VendorwiseInventoryStatusComponent } from './vendorwise-inventory-status/vendorwise-inventory-status.component';
import { AuthGuard } from './guards/auth.guard';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { EditReceiptComponentComponent } from './edit-receipt-component/edit-receipt-component.component';
import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockTransferAnomalyComponent } from './stock-transfer-anomaly/stock-transfer-anomaly.component';

import { AppComponent } from './app.component';
import { AdditemComponent } from './additem/additem.component';
import { EditentryComponent } from './editentry/editentry.component';
import { SavereportComponent } from './savereport/savereport.component';
import { InventoryAdditionReportComponent } from './inventory-addition-report/inventory-addition-report.component'
import { RetailOutletsComponent } from './retail-outlets/retail-outlets.component';


export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'additem', component: AdditemComponent, canActivate:[AuthGuard]},
    { path: 'editentry', component: EditentryComponent, canActivate:[AuthGuard]},
    { path: 'stocktransfer',component: StocktransferComponent,canActivate:[AuthGuard]},
    { path: 'vendorwise-inventory-status',component: VendorwiseInventoryStatusComponent,canActivate:[AuthGuard]},
    { path: 'itemwise-inventory-status',component: ItemwiseInventoryStatusComponent,canActivate:[AuthGuard]},
    { path: 'item-master',component: ItemMasterComponent,canActivate:[AuthGuard]},
    { path: 'dd-stock-report',component: DdStockReportComponent,canActivate:[AuthGuard]},
    { path: 'stock-transfer-anomaly',component: StockTransferAnomalyComponent,canActivate:[AuthGuard]},
    { path: 'inventory-addition-report',component: InventoryAdditionReportComponent,canActivate:[AuthGuard]},
    { path: 'savereport', component: SavereportComponent,children:[
        {path:'',redirectTo:'savereport/stocktransfer',pathMatch: 'full'},
        {path:'savereport/stocktransfer',component: StocktransferComponent},
        {path:'savereport/vendorwise-inventory-status',component:VendorwiseInventoryStatusComponent}
    ],canActivate:[AuthGuard]},
    { path: 'login', component: LoginComponent},
    { path: 'logout', component: LogoutComponent},
    { path: 'login/reset', component: ResetPasswordComponent},
    { path: 'editreceipt', component: EditReceiptComponentComponent},
    { path: 'inventorydetails', component: InventoryDetailsComponent},
    { path: 'restockitem', component: RestockitemComponent,canActivate:[AuthGuard]},
    { path: 'restock-bulk', component: RestockBulkUploadComponent,canActivate:[AuthGuard]},
    { path: 'fileupload', component: FileuploadComponent, canActivate:[AuthGuard]},
    { path: 'additem', component: AdditemComponent, canActivate:[AuthGuard]},
    { path: 'retail-outlets', component: RetailOutletsComponent, canActivate:[AuthGuard]}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
