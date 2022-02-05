import { LightningElement, api } from "lwc";
import getFieldsFromFieldSet from "@salesforce/apex/FieldSetHelper.getFieldsFromFieldSet";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CreateRecordFromFieldset extends LightningElement {
    lblobjectName; //this displays the Object Name whose records are getting displayed
    inputFieldAPIs = [];
    renderCall = false;

    //get its value from container component through attributes
    @api sfdcObjectApiName; //Case
    @api fieldSetName; //QuickCaseFS

    @api recordId = "";

    //load the record edit form with fields from fieldset.
    connectedCallback() {
        let objectApiName = this.sfdcObjectApiName;
        let fieldSetName = this.fieldSetName;

        //make an implicit call to fetch fields from database
        getFieldsFromFieldSet({
            strObjectApiName: objectApiName,
            strfieldSetName: fieldSetName
        })
            .then((data) => {
                let items = []; //local array to hold the field api

                //get the entire map
                let objStr = JSON.parse(data);
                //get the list of fields, its a reverse order to extract from map
                let listOfFields = JSON.parse(Object.values(objStr)[1]);
                //get the object name
                this.lblobjectName = Object.values(objStr)[0];
                //prepare items array using field api names
                listOfFields.map((element) => items.push(element.fieldPath));

                this.inputFieldAPIs = items;
                console.log("inputFieldAPIs", this.inputFieldAPIs);
                console.log(this.inputFieldAPIs);
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                console.log("error", error);
                this.lblobjectName = objectApiName;
            });
    }

    renderedCallback() {
        if (!this.renderCall) {
            this.renderCall = true;
            this.dispatchEvent(new CustomEvent("cmploaded"));
        }
    }

    //This method submits the record edit form and getting called from container component
    @api
    handleSubmit() {
        this.template.querySelector("lightning-record-edit-form").submit();
    }

    //This event handler fires on post submit and displays success and propagate event to container
    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: this.lblobjectName + " created",
            message: "Record ID: " + event.detail.id,
            variant: "success"
        });
        this.dispatchEvent(evt);

        //raise event to parent to handle this and to close the popup, specify bubbles=true
        this.dispatchEvent(new CustomEvent("postsuccess"), { bubbles: true });
    }
}
