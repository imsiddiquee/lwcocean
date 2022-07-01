import lookUp from "@salesforce/apex/AccountLookup.SearchData";
import { api, LightningElement, track, wire } from "lwc";

// source https://www.forcetree.com/2020/06/custom-lookup-component-in-lwc.html

export default class CustomLookUp extends LightningElement {
    @api objName = "";
    @api controlKey = "Account";
    @api iconName = "";
    @api filter = "";
    @api searchPlaceholder = "Search";
    @track selectedName;
    @track records = [];
    @track isValueSelected = false;
    @track blurTimeout;
    searchTerm = "";
    //css
    @track boxClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus";
    @track inputClass = "";
    @wire(lookUp, { searchTerm: "$searchTerm", myObject: "$objName", filter: "$filter" })
    wiredRecords({ error, data }) {
        console.log("data-->", data);
        if (data) {
            this.error = undefined;
            this.records = data;
        } else if (error) {
            console.log("error-->", error);
            this.error = error;
            this.records = [];
        }
    }
    handleClick() {
        this.searchTerm = "";
        this.inputClass = "slds-has-focus";
        this.boxClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus slds-is-open";
    }

    onBlur() {
        this.blurTimeout = setTimeout(() => {
            this.boxClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus";
        }, 300);
    }

    onSelect(event) {
        let selectedId = event.currentTarget.dataset.id;
        let selectedName = event.currentTarget.dataset.name;

        this.updateParent(selectedId, selectedName);

        this.isValueSelected = true;
        this.selectedName = selectedName;
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
        }
        this.boxClass = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-has-focus";
    }

    handleRemovePill() {
        console.log("handleRemovePill");
        this.updateParent("", "");
        this.isValueSelected = false;
    }

    onChange(event) {
        this.searchTerm = event.target.value;
    }

    updateParent(selectedId, selectedText) {
        // const valueSelectedEvent = new CustomEvent("lookupselected", { detail: selectedId });
        // this.dispatchEvent(valueSelectedEvent);

        const selectedEvent = new CustomEvent("lookupselected", {
            detail: {
                controlKey: this.controlKey,
                label: selectedText,
                value: selectedId
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}
