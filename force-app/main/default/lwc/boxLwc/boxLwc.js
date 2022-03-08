import { LightningElement, wire, api } from "lwc";

import getVisualforceOrigin from "@salesforce/apex/VFC_DomainsController.getVisualforceOrigin";

export default class BoxLwc extends LightningElement {
    @wire(getVisualforceOrigin) visualForceOrigin;
    receivedMessage;
    messageToSend;
    @api recordId;
    handleResponse2 = true;

    connectedCallback() {
        // Binding EventListener here when Data received from VF
        // param1 - the event which will listen the message
        // param2 - the method which will be called when the message will be recieved
        // param3 - event capture
        console.log("connectedCallback");
        window.addEventListener("message", this.handleResponse.bind(this), false);
    }

    // renderedCallback() {
    //     if (this.handleResponse2) {
    //         console.log("renderedCallback");
    //         this.sendMessgaeToVisualForce();
    //         console.log("renderedCallback");
    //         this.handleResponse2 = false;
    //     }
    // }

    handleResponse(message) {
        // check the origin match for both source and target
        if (message.origin === this.visualForceOrigin.data) {
            this.receivedMessage = JSON.stringify(message.data);
        }
    }

    handleChange(event) {
        this.messageToSend = event.detail.value;
    }
    loadData() {
        this.sendMessgaeToVisualForce();
    }

    sendMessgaeToVisualForce() {
        let message = {
            message: "test",
            source: this.recordId
        };
        console.log("sendMessgaeToVisualForce--message2", message);

        let visualForce = this.template.querySelector("iframe");

        if (visualForce) {
            //console.log("visualForce-->", this.visualForceOrigin.data);
            console.log("visualForce url-->", window.location.origin.split(".")[0] + "--c.visualforce.com");
            visualForce.contentWindow.postMessage(
                this.recordId,
                window.location.origin.split(".")[0] + "--c.visualforce.com"
            );
        }
    }
}
