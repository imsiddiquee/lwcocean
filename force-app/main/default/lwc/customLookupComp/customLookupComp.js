import { LightningElement, wire, track, api } from "lwc";
import getLookupDetails from "@salesforce/apex/AccountSearchController.getLookupDetails";
export default class CustomLookupComp extends LightningElement {
    @api targetObjectName = "Account";
    accountName = "";
    @track accountList = [];
    @track accountId;
    @track messageResult = false;
    @track isShowResult = true;
    @track showSearchedValues = false;
    @wire(getLookupDetails, { sObjectName: "$targetObjectName", actName: "$accountName" })
    retrieveAccounts({ error, data }) {
        this.messageResult = false;
        if (data) {
            // TODO: Error handling
            console.log("data::" + data.length);
            console.log("data::" + data);
            if (data.length > 0 && this.isShowResult) {
                this.accountList = JSON.parse(data);
                this.showSearchedValues = true;
                this.messageResult = false;
            } else if (data.length === 0) {
                this.accountList = [];
                this.showSearchedValues = false;
                if (this.accountName !== "") this.messageResult = true;
            }
        } else if (error) {
            console.log(error);
            // TODO: Data handling
            this.accountId = "";
            this.accountName = "";
            this.accountList = [];
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
        this.accountName = event.target.value;
    }

    handleParentSelection(event) {
        console.log("handleParentSelection");
        this.showSearchedValues = false;
        this.isShowResult = false;
        this.messageResult = false;
        //Set the parent calendar id
        this.accountId = event.target.dataset.value;
        //Set the parent calendar label
        this.accountName = event.target.dataset.label;
        console.log("accountId::" + this.accountId);
        const selectedEvent = new CustomEvent("selected", { detail: this.accountId });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}
