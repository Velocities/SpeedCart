
export interface GroceryItem {
    item_id: number;
    name: string;
    is_food: boolean;
    quantity: number;
    list_id: any; // This is technically a uuid value
}