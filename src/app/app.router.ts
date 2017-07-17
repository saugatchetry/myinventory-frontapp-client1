import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LogoutComponent } from './logout/logout.component';
import { DdStockReportComponent } from './dd-stock-report/dd-stock-report.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { ItemwiseInventoryStatusComponent } from './itemwise-inventory-status/itemwise-inventory-status.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import { RestockitemComponent } from './restockitem/restockitem.component';
import { InventoryDetailsComponent } from './inventory-details/inventory-details.component';
import { VendorwiseInventoryStatusComponent } from './vendorwise-inventory-status/vendorwise-inventory-status.component';
import { AuthGuard } from './guards/auth.guard';
import { StocktransferComponent } from './stocktransfer/stocktransfer.component';
import { EditReceiptComponentComponent } from './edit-receipt-component/edit-receipt-component.component';
import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdditemComponent } from './additem/additem.component';
import { EditentryComponent } from './editentry/editentry.component';
import { SavereportComponent } from './savereport/savereport.component';
import { InventoryAdditionReportComponent } from './inventory-addition-report/inventory-addition-report.component'


export const router: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full'},
    { path: 'additem', component: AdditemComponent, canActivate:[AuthGuard]},
    { path: 'editentry', component: EditentryComponent, canActivate:[AuthGuard]},
    { path: 'stocktransfer',component: StocktransferComponent,canActivate:[AuthGuard]},
    { path: 'vendorwise-inventory-status',component: VendorwiseInventoryStatusComponent,canActivate:[AuthGuard]},
    { path: 'itemwise-inventory-status',component: ItemwiseInventoryStatusComponent,canActivate:[AuthGuard]},
    { path: 'item-master',component: ItemMasterComponent,canActivate:[AuthGuard]},
    { path: 'dd-stock-report',component: DdStockReportComponent,canActivate:[AuthGuard]},
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
    { path: 'fileupload', component: FileuploadComponent, canActivate:[AuthGuard]},
    { path: 'additem', component: AdditemComponent, canActivate:[AuthGuard]}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
