import { LightningElement, api } from 'lwc';

const 
    EVENT_BACK_BUTTON = "backbuttonclick",
    EVENT_SETTING_TOGGLED = "settingtoggled";

export default class ScannerSettings extends LightningElement {
    @api settings;

    blah = "asd";

    backButtonPressed() {
        this.dispatchEvent(
            new CustomEvent(
                EVENT_BACK_BUTTON
            )
        );
    }

    wasToggled(event) {
        this.blah = JSON.stringify(event.detail);

        this.dispatchEvent(
            new CustomEvent(
                EVENT_SETTING_TOGGLED,
                {
                    detail: {
                        type: event.detail.type,
                        checked: event.detail.checked
                    }
                }
            )
        );
    }
}