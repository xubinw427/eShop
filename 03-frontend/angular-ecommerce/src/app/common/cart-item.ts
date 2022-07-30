import { Product } from "./product";

export class CartItem {

    id: string | undefined;
    name: string | undefined;
    imgUrl: string | undefined;
    unitPrice: number | undefined;

    quantity: number | undefined;

    constructor(product: Product){
        this.id = product.id;
        this.name = product.name;
        this.imgUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;

        this.quantity  = 1;

    }

}
