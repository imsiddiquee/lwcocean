import { api, LightningElement, track, wire } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import ACCOUNT_SOURCE_FIELD from "@salesforce/schema/Account.AccountSource";

import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import ACCOUNT_SOURCE_DEAULT_FIELD from "@salesforce/schema/Account.AccountSource";
const fields = [ACCOUNT_SOURCE_DEAULT_FIELD];

export default class PathCom extends LightningElement {
    @track
    currentStep = "";
    //recordId = "0015g00000BoIPgAAN";
    @api
    recordId = "";

    @track
    steps;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: ACCOUNT_SOURCE_FIELD
    })
    wiredAccounntSourceItems(response) {
        let data = response.data;
        let error = response.error;

        if (data) {
            this.steps = data.values;
        } else if (error) {
            console.log("error");
        }
    }

    @wire(getRecord, { recordId: "$recordId", fields })
    wiredAccounntSourceDefaultItem(response) {
        this.wiredResponse = response;

        let data = response.data;
        let error = response.error;

        if (data) {
            this.currentStep = data.fields.AccountSource.value;
        } else if (error) {
            console.log("error");
        }
    }
}
