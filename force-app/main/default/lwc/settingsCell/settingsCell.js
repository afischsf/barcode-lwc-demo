import { LightningElement, api } from 'lwc';

const EVENT_SETTING_TOGGLED = "settingtoggled";

export default class SettingsCell extends LightningElement {
    @api setting;

    toggleChanged(event) {
        this.dispatchEvent(
            new CustomEvent(
                EVENT_SETTING_TOGGLED,
                {
                    detail: {
                        checked: event.target.checked,
                        type: this.setting.type
                    }
                }
            )
        );
    }
}