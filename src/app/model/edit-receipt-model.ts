export class EditModel{
    public itemName: string;
    public quantity: string;
    public customerName: string;
    public receiptOutletName: string;
    public id:number;
    
    constructor(id:number,itemName:string,quantity:string,customerName:string,receiptOutletName:string){

        this.customerName = customerName;
        this.id = id;
        this.itemName = itemName;
        this.quantity = quantity;
        this.receiptOutletName = receiptOutletName;

    }
    

}