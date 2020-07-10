import { LightningElement, track } from 'lwc';
import scannerPicker from './scanner-picker.html';
import singleScan from './barcodeManager.html';
import detailPage from './detail.html';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

export default class NimbusBarcodeScanner extends LightningElement {

    barcodeScanner;
    screenNumber = "1";

    detailType;
    @track detail;
    @track error;

    @track singleScanRecords = [];
    @track multipleScanRecords = [];

    // eslint-disable-next-line consistent-return
    render() {
        // eslint-disable-next-line default-case
        switch (this.screenNumber) {
            case "1":
                return scannerPicker;
            case "2":
                return singleScan;
            case "4":
                return detailPage;
        }
    }

    switchTemplate(e) {
        this.screenNumber = e.target.value;

        if (e.target.name === "single") {
            this.openSingleScan();
        }
    }

    connectedCallback() {
        this.barcodeScanner = getBarcodeScanner();
    }

    openSingleScan() {
        if (this.barcodeScanner.isAvailable()) {
            this.barcodeScanner.beginCapture(
                { barcodeTypes: [] }
            )
            .then((barcode) => {
                const last = this.last(this.singleScanRecords)
                let count = 0;
                if (last !== undefined) {
                    count = last.id;
                }
                count++;
    
                this.singleScanRecords.push({
                    id: count,
                    name: "",
                    description: "",
                    quantity: 1,
                    barcode: barcode.value
                });

                this.detail = Object.assign({}, this.singleScanRecords[this.singleScanRecords.length - 1]);
                this.detailType = "single";
                this.screenNumber = "4";
            })
            .catch(error => {
                this.error = error;
            })
            .finally(() => this.barcodeScanner.endCapture());
        }
    }

    viewDetail(event) {
        const id = event.currentTarget.dataset.id;
        this.detailType = event.currentTarget.dataset.type;
        let detail;
        if (this.detailType === "single") {
            detail = this.singleScanRecords.find(value => value.id  == id);
        }
        this.detail = Object.assign({}, detail);
        this.screenNumber = "4";
    }

    backButtonPressed() {
        if (this.detailType === "single") {
            this.screenNumber = "2";
        }
    }

    savePressed() {
        if (this.detailType === "single") {
            const index = this.singleScanRecords.findIndex(x => x.id == this.detail.id);
            this.singleScanRecords[index] = this.detail;
            this.screenNumber = "2";
        }
    }

    textInputChange(event) {
        const field = event.target.name;
        this.detail[field] = event.target.value;
    }

    last(array) {
        if (array.length > 0)
            return array[array.length - 1];

        return undefined;
    }
}