import { LightningElement,wire } from 'lwc';
import getPicklistValues from '@salesforce/apex/grandAidsClass.getPicklistValues';


/**
 * DEPENDENT COMPONENTS ARE
 * 
 * lwcReusableCustomLookupComp
 * lwcReusablePicklistComp
 */

export default class LwcTaskReminder extends LightningElement {

    selectedSubject    
    subjectList;
    processing; 

    picklist_selectedSubject;

    
    
    lookup_contact_selectedId=''; 
    lookup_contact_selectedLabel=''; 

    
    lookup_assignedTo_selectedId=''; 
    lookup_assignedTo_selectedLabel=''; 


    @wire(getPicklistValues, {
        objectName:'Task', 
        fieldName: 'Subject'
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
            
            this.subjectList=dataContainer;
            
           
        }
        else if(error)
        {
            console.log('subjectList error-->',error);
        }
        
    }


    handleLookupSelectedItem(event)
    {
        console.log('event.detail-->',event.detail);
        if(event.detail)
        {
            if(event.detail.controlKey===this.lookup_contact_key)
            {
                this.lookup_contact_selectedId=event.detail.value;
                this.lookup_contact_selectedLabel=event.detail.label;
                
            }
            if(event.detail.controlKey===this.lookup_assignedTo_key)
            {
                this.lookup_assignedTo_selectedId=event.detail.value;
                this.lookup_assignedTo_selectedLabel=event.detail.label;
                
            }
        }
    }

    handleSelectedpicklistitem(event)
    {
        // console.log('handleSelectedpicklistitem-->',event);
        // console.log('handleSelectedpicklistitem-->',event.detail);

        if(event.detail)
        {
            console.log('event.detail-->',event.detail.controlKey);

            if(event.detail.controlKey==='subject')
            {
                //this.picklist_selectedSubject=event.detail.label;
                this.picklist_selectedSubject=event.detail.value;
                console.log('picklist_selectedSubject-->',this.picklist_selectedSubject);
            }
        }
    }
    
}