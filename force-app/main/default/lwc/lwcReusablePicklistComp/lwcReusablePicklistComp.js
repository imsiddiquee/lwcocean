import { api, LightningElement, wire } from 'lwc';
import getPicklistValues from '@salesforce/apex/grandAidsClass.getPicklistValues';

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

export default class LwcReusablePicklistComp extends LightningElement {
    @api picklistControlLabel='control label';    
    @api targetObjectName='';
    @api targetFieldName='';
    @api controlKey='';
    
    controlSelectedValue;
    pickListValues;

    @wire(getPicklistValues, {
        objectName:'$targetObjectName', 
        fieldName: '$targetFieldName'
    }) wiredGetSubjectList(response)
    {
        let data=response.data;
        let error=response.error

        if(data||error)
        {
            this.processing=false;
        }

        if(data)
        {
            let dataContainer=[];
            for(let key in data)
            {
                dataContainer.push({label:key,value:data[key]});
            }
            console.log('dataContainer-->',dataContainer);
            
            this.pickListValues=dataContainer;
            
           
        }
        else if(error)
        {
            console.log('subjectList error-->',error);
        }
        
    }


    handlePicklistValueChange(event)
    {
        this.selectedSubject=event.target.value;
        // console.log('selected value-->',event.target);
        // console.log('selected value-->',this.selectedSubject);

        const selectedEvent = new CustomEvent("selectedpicklistitem", {
            detail: {
                controlKey: this.controlKey,
                label: this.pickListValues.find(opt => opt.value === event.target.value).label,
                value:  event.target.value
            }
        });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }
}