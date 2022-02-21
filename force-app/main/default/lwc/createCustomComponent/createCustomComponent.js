import { api, LightningElement } from "lwc";

export default class CreateCustomComponent extends LightningElement {
    @api itemType;
    @api itemKey;
    @api itemPlaceholder;
    @api itemValue = "";
}
