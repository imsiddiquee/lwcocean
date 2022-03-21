import { LightningElement, wire, track, api } from "lwc";
import getLookupDetails from "@salesforce/apex/AccountSearchController.getLookupDetails";
export default class CustomLookupComp extends LightningElement {
    @api targetObjectName = "Account";
    @api controlKey = "Account";
    searchText = "";
    @track searchResultList = [];
    @track selectedRecordId;
    @track messageResult = false;
    @track isShowResult = true;
    @track showSearchedValues = false;
    @wire(getLookupDetails, { sObjectName: "$targetObjectName", actName: "$searchText" })
    retrieveAccounts({ error, data }) {
        this.messageResult = false;
        if (data) {
            // TODO: Error handling
            //console.log("data::" + data.length);
            //console.log("data::" + data);
            if (data.length > 0 && this.isShowResult) {
                this.searchResultList = JSON.parse(data);
                this.showSearchedValues = true;
                this.messageResult = false;
            } else if (data.length === 0) {
                this.searchResultList = [];
                this.showSearchedValues = false;
                if (this.searchText !== "") this.messageResult = true;
            }
        } else if (error) {
            console.log(error);
            // TODO: Data handling
            this.selectedRecordId = "";
            this.searchText = "";
            this.searchResultList = [];
            this.showSearchedValues = false;
            this.messageResult = true;
        }
    }
    handleClick(event) {
        this.isShowResult = true;
        this.messageResult = false;
    }
    handleKeyChange(event) {
        console.log("handleKeyChange");
        this.messageResult = false;
        this.searchText = event.target.value;
    }

    handleParentSelection(event) {
        console.log("handleParentSelection");
        this.showSearchedValues = false;
        this.isShowResult = false;
        this.messageResult = false;
        //Set the parent calendar id
        this.selectedRecordId = event.target.dataset.value;
        //Set the parent calendar label
        this.searchText = event.target.dataset.label;
        console.log("selectedRecordId::", {
            controlKey: this.controlKey,
            label: this.selectedRecordId,
            value: this.searchText
        });
        const selectedEvent = new CustomEvent("selected", {
            detail: {
                controlKey: this.controlKey,
                label: this.selectedRecordId,
                value: this.searchText
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}
