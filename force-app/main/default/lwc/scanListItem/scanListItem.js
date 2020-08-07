import { LightningElement, api } from "lwc";

const
    EVENT_DELETE_ITEM_CLICK = "deleteitemclick",
    EVENT_ITEM_CLICK = "itemclick";

export default class ScanListItem extends LightningElement {
    @api item;
    @api isFirstItem;
    @api scanType;

    deleteItem(event) {
        event.stopPropagation();
        this.dispatchEvent(
            new CustomEvent(
                EVENT_DELETE_ITEM_CLICK,
                { 
                    detail: {
                        scanType: this.scanType,
                        itemId: this.item.id
                    }
                }
            )
        )
    }

    cellTapped(event) {
        this.dispatchEvent(
            new CustomEvent(
                EVENT_ITEM_CLICK,
                { 
                    detail: {
                        scanType: this.scanType,
                        itemId: this.item.id
                    }
                }
            )
        )
    }
}