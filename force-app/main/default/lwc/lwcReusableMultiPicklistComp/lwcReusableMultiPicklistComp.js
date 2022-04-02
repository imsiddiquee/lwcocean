import { api, LightningElement, track, wire } from "lwc";
import getPicklistValues from "@salesforce/apex/grandAidsClass.getPicklistValues";

/**
 * REUSABLE CONTROL SPECIFICATION
 * <c-lwc-reusable-picklist-comp target-object-name="Task" target-field-name="Subject" picklist-control-label="Subject" control-key="subject" onselectedpicklistitem={handleSelectedpicklistitem}></c-lwc-reusable-picklist-comp>
 *
 * target-object-name= NAME OF OBJECT WHICH HAS PICKLIST.
 * target-field-name= PICKLIST FIELD NAME
 * picklist-control-label= CONTROL DISPLAY LABEL
 * control-key= KEY HELP TO IDENTIFY SELECTED ITEM
 * onselectedpicklistitem= PARENT IMPLEMENT THE EVENT TO GET THE PICKLIST SELECTED ITEMS
 */

export default class LwcReusableMultiPicklistComp extends LightningElement {
    @api picklistControlLabel = "control label";
    @api targetObjectName = "";
    @api targetFieldName = "";
    @api controlKey = "";

    @track globalSelectedItems = []; //holds all the selected checkbox items
    @track pickListValues; //holds picklist all items from apex

    get hasDefaultResults() {
        //check if array has data
        return this.globalSelectedItems.length > 0 ? `${this.globalSelectedItems.length} options selected` : "Select";
    }

    @wire(getPicklistValues, {
        objectName: "$targetObjectName",
        fieldName: "$targetFieldName"
    })
    wiredGetSubjectList(response) {
        let data = response.data;
        let error = response.error;

        if (data || error) {
            this.processing = false;
        }

        if (data) {
            let dataContainer = [];
            for (const key in data) {
                if ({}.hasOwnProperty.call(data, key)) {
                    dataContainer.push({ label: key, value: data[key] });
                }
            }
            //console.log("loop data-->", data);
            //console.log("dataContainer-->", dataContainer);

            this.pickListValues = dataContainer;
        } else if (error) {
            console.log("subjectList error-->", error);
        }
    }

    handlePicklistValueChange(event) {
        console.log("selected value-->", event.target.value);

        if (!event.target.value) {
            console.log("invalid item");
            return;
        }

        //get current select item
        let selectItemTemp = this.pickListValues.find((opt) => opt.value === event.target.value);

        let newSelectedItem = this.globalSelectedItems.find((element) => element.value === selectItemTemp.value);
        console.log("newSelectedItem-->", JSON.stringify(newSelectedItem));

        if (selectItemTemp !== undefined && newSelectedItem === undefined) {
            this.globalSelectedItems.push(selectItemTemp);
        }

        //default select combo-box first item.
        this.template.querySelector(`[data-id="${this.controlKey}"]`).selectedIndex = 0;

        //update parent
        const selectedEvent = new CustomEvent("selected_multipicklist_item", {
            detail: {
                controlKey: this.controlKey,
                items: this.globalSelectedItems
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    handleRemoveRecord(event) {
        const removeItem = event.target.dataset.item;

        //this will prepare globalSelectedItems array excluding the item to be removed.
        this.globalSelectedItems = this.globalSelectedItems.filter((item) => item.value !== removeItem);

        //update parent
        const selectedEvent = new CustomEvent("selected_multipicklist_item", {
            detail: {
                controlKey: this.controlKey,
                items: this.globalSelectedItems
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}
