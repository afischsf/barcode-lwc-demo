import { LightningElement, api } from "lwc";

export default class ScanListItem extends LightningElement {
    @api item;
    @api isFirstItem;
}