import { LightningElement, api } from "lwc";
import getFieldsFromFieldSet from "@salesforce/apex/FieldSetHelper.getFieldsFromFieldSet";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

/**
 * dependent components are
 * createRecordFromFieldset
CreateCustomComponent
CustomLookupComp
FieldSetHelper
 */

// [
//     {
//         "dbRequired": false,
//         "fieldPath": "Status",
//         "label": "Status",
//         "required": false,
//         "type": "picklist",
//         "typeApex": "PICKLIST"
//     },
//     {
//         "dbRequired": false,
//         "fieldPath": "AccountId",
//         "label": "Account ID",
//         "required": false,
//         "type": "reference",
//         "typeApex": "REFERENCE"
//     },
//     {
//         "dbRequired": false,
//         "fieldPath": "Subject",
//         "label": "Subject",
//         "required": false,
//         "type": "string",
//         "typeApex": "STRING"
//     },
//     {
//         "dbRequired": false,
//         "fieldPath": "Origin",
//         "label": "Case Origin",
//         "required": false,
//         "type": "picklist",
//         "typeApex": "PICKLIST"
//     },
//     {
//         "dbRequired": false,
//         "fieldPath": "Description",
//         "label": "Description",
//         "required": false,
//         "type": "textarea",
//         "typeApex": "TEXTAREA"
//     },
//     {
//         "dbRequired": false,
//         "fieldPath": "ClosedDate",
//         "label": "Closed Date",
//         "required": false,
//         "type": "datetime",
//         "typeApex": "DATETIME"
//     }
// ]

export default class CreateRecordFromFieldset extends LightningElement {
    lblobjectName; //this displays the Object Name whose records are getting displayed
    inputFieldAPIs = [];
    renderCall = false;
    listOfFields = [];

    //get its value from container component through attributes
    @api sfdcObjectApiName = "Case"; //Case
    @api fieldSetName = "QuickCaseFS"; //QuickCaseFS

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
                console.log(objStr);
                //get the list of fields, its a reverse order to extract from map
                let listOfFields = JSON.parse(Object.values(objStr)[0]);
                console.log("listOfFields-->", listOfFields);
                this.listOfFields = listOfFields;
                //get the object name
                this.lblobjectName = Object.values(objStr)[1];
                //prepare items array using field api names
                listOfFields.map((element) => items.push(element.fieldPath));

                this.inputFieldAPIs = items;
                console.log("listOfFields-->", listOfFields);
                console.log("inputFieldAPIs-->", this.inputFieldAPIs);
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
