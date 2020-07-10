import { LightningElement, api } from "lwc";

export default class Controls extends LightningElement {
    @api settingsData;

    reloadPage() {
        window.location.reload();
    }

    showSettingsPage(e) {

    }
}