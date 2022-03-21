import { api, LightningElement } from "lwc";

export default class CreateCustomComponent extends LightningElement {
    @api itemType;
    @api targetObjectName = "Account";
    @api itemKey;
    @api itemPlaceholder;
    @api itemValue = "";
    @api pickListOptions = "";

    profileOptionsList;

    get showTextBox() {
        if (this.itemType !== "picklist" && this.itemType !== "reference") {
            return true;
        }

        return false;
    }

    get showPickList() {
        if (this.itemType === "picklist") {
            let tempArray = [];
            if (this.pickListOptions) {
                for (let currentItem in this.pickListOptions) {
                    if (currentItem != null) {
                        console.log("key-->", currentItem);
                        tempArray.push({ label: this.pickListOptions[currentItem], value: currentItem });
                    }
                }
            }
            this.profileOptionsList = tempArray;

            return true;
        }

        return false;
    }

    get showLookup() {
        if (this.itemType === "reference") {
            return true;
        }

        return false;
    }

    handleSelected(event) {
        console.log("payload-->", event.detail);
    }
}
