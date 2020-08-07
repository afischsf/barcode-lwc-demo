import { LightningElement, track } from 'lwc';
import scannerPicker from './scanner-picker.html';
import barcodeListPage from './barcodeManager.html';
import detailPage from './detail.html';
import { getBarcodeScanner } from 'lightning/mobileCapabilities';

import resources from '@salesforce/resourceUrl/barcodeScanner';

export default class NimbusBarcodeScanner extends LightningElement {

    splashLogo = `${resources}/barcodeScannerResource/splashScreen.svg`;

    barcodeScanner;
    screenNumber = "1";
    selectedTab = "multi";

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
                return barcodeListPage;
            case "4":
                return detailPage;
        }
    }

    connectedCallback() {
        this.barcodeScanner = getBarcodeScanner();
    }

    openSingleScan() {
        this.selectedTab = "single";
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

    openMultiScan() {
        this.selectedTab = "multi";
        if (this.barcodeScanner.isAvailable()) {
            this.barcodeScanner.beginCapture(
                { barcodeTypes: [] }
            )
            .then((barcode) => this.addMultiScannedBarcode(barcode))
            .catch(error => {
                this.error = error;
                this.barcodeScanner.endCapture();
            })
            .finally(() => this.continueMultiScan());
        }
    }

    continueMultiScan() {
        if (this.barcodeScanner.isAvailable()) {
            setTimeout(() => {
                this.barcodeScanner.resumeCapture()
                .then((barcode) => this.addMultiScannedBarcode(barcode))
                .catch((error) => {
                    this.error = error;
                    this.barcodeScanner.endCapture();
                })
                .finally(() => this.continueMultiScan());
            }, 1000);
        }
    }

    addMultiScannedBarcode(barcode) {
        const last = this.last(this.multipleScanRecords)
        let count = 0;
        if (last !== undefined) {
            count = last.id;
        }
        count++;

        this.multipleScanRecords.push({
            id: count,
            name: "",
            description: "",
            quantity: 1,
            barcode: barcode.value
        });

        this.detail = Object.assign({}, this.multipleScanRecords[this.multipleScanRecords.length - 1]);
        this.detailType = "multi";
        this.screenNumber = "2";
    }

    viewDetail(event) {
        const id = event.detail.itemId;
        this.detailType = event.detail.scanType;
        let detail;
        if (this.detailType === "single") {
            detail = this.singleScanRecords.find(value => value.id  == id);
        } else if (this.detailType === "multi") {
            detail = this.multipleScanRecords.find(value => value.id  == id);
        }
        this.detail = Object.assign({}, detail);
        this.screenNumber = "4";
    }

    deleteDetail(event) {
        const id = event.detail.itemId;
        if (event.detail.scanType === "single") {
            const index = this.singleScanRecords.findIndex(item => item.id == id);
            if (index > -1) {
                this.singleScanRecords.splice(index, 1);
            }
        } else if (event.detail.scanType === "multi") {
            const index = this.multipleScanRecords.findIndex(item => item.id == id);
            if (index > -1) {
                this.multipleScanRecords.splice(index, 1);
            }
        }
    }

    backButtonPressed() {
        this.screenNumber = "2";
    }

    savePressed() {
        if (this.detailType === "single") {
            const index = this.singleScanRecords.findIndex(x => x.id == this.detail.id);
            this.singleScanRecords[index] = this.detail;
        } else if (this.detailType === "multi") {
            const index = this.multipleScanRecords.findIndex(x => x.id == this.detail.id);
            this.multipleScanRecords[index] = this.detail;
        }
        this.screenNumber = "2";
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