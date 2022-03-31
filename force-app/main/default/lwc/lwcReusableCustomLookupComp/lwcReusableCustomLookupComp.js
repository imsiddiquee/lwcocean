import { LightningElement, wire, track, api } from "lwc";
import getLookupDetails from "@salesforce/apex/grandAidsClass.getLookupDetails";

/**
 * REUSABLE CONTROL SPECIFICATION
 * <c-lwc-reusable-custom-lookup-comp target-object-name="User" control-key="User" control-label="Assigned To" onselectedlookupitem={handleLookupSelectedItem}> </c-lwc-reusable-custom-lookup-comp>
 * target-object-name=LOOK UP OBJECT NAME
 * control-key= KEY HELP TO GET SELECTED ITEM
 * control-label=DISPLAY CONTROL LABEL
 * onselectedlookupitem= PARENT CONTROLLER IMPLEMENT EVENT TO GET THE SELECTED
 */

export default class CustomLookupComp extends LightningElement {
    @api targetObjectName = "Account";
    @api controlKey = "Account";
    @api controlLabel = "control-label";
    searchText = "";
    @track searchResultList = [];
    @track selectedRecordId;
    @track messageResult = false;
    @track isShowResult = true;
    @track showSearchedValues = false;

    get getSearchIcon()
    {
        console.log('getSearchIcon',this.searchText>0?'utility:close':'utility:search');
       return  this.searchText>0?'utility:close':'utility:search';

        
    }
    


    @wire(getLookupDetails, { sObjectName: "$targetObjectName", searchText: "$searchText" })
    retrieveAccounts({ error, data }) {
        this.messageResult = false;
        if (data) {
            console.log('search data-->',data);
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
        console.log('handleClick');
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

        this.updateParent();
      
    }

    updateParent()
    {
        const selectedEvent = new CustomEvent("selectedlookupitem", {
            detail: {
                controlKey: this.controlKey,
                label: this.searchText,
                value:  this.selectedRecordId
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    handleRemoveRecord(event)
    {
        this.selectedRecordId = "";
        this.searchText = "";
        this.searchResultList = [];
        this.showSearchedValues = false;
        this.messageResult = true;

        this.updateParent();
    }
}