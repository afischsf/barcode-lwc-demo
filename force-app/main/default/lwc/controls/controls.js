import { LightningElement } from "lwc";

const EVENT_SHOW_SETTINGS = "showsettingsclick";

export default class Controls extends LightningElement {

    reloadPage() {
        window.location.reload();
    }

    showSettingsPage() {
        this.dispatchEvent(
            new CustomEvent(
                EVENT_SHOW_SETTINGS
            )
        );
    }
}