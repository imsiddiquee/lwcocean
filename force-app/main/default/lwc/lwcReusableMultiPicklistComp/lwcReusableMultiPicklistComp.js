import { api, LightningElement, track, wire } from 'lwc';
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

export default class LwcReusableMultiPicklistComp extends LightningElement {
    @api picklistControlLabel='control label';    
    @api targetObjectName='';
    @api targetFieldName='';
    @api controlKey='';

    @track globalSelectedItems = []; //holds all the selected checkbox items
    
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
        // this.selectedSubject=event.target.value;
        console.log('selected value-->',event.target.value);     
        
        if(!event.target.value)
        {
            console.log('invalid item');
            return;
        }
        

        let selectItemTemp = this.pickListValues.find(opt => opt.value === event.target.value);
        // console.log('selected label-->',selectedLabel);
        console.log('controlKey-->',this.controlKey);
        console.log('selectItemTemp-->',selectItemTemp);

         //working

         //let selectItemTemp = event.detail.value;
         
         //this.globalSelectedItems = []; //it will hold only newly selected checkbox items.        
         
         /* find the value in items array which has been prepared during database call
            and push the key/value inside selectedItems array           
         */
        

            
        let newSelectedItem = this.globalSelectedItems.find(element => element.value === selectItemTemp.value);
        console.log('newSelectedItem-->',JSON.stringify(newSelectedItem));

        

        //arr = value: "0032v00002x7UEHAA2", label: "Arthur Song
        if(selectItemTemp !== undefined && newSelectedItem===undefined){
            this.globalSelectedItems.push(selectItemTemp);
        }  
        

           
        console.log('selectedItems-->',JSON.stringify(this.globalSelectedItems));


         //
               
        // const selectedEvent = new CustomEvent("selectedpicklistitem", {
        //     detail: {
        //         controlKey: this.controlKey,
        //         label: selectedLabel,
        //         value: event.target.value
        //     }
        // });
        // // Dispatches the event.
        // this.dispatchEvent(selectedEvent);
    }

    handleRemoveRecord(event)
    {
        const removeItem = event.target.dataset.item; //"0032v00002x7UEHAA2"
        
        //this will prepare globalSelectedItems array excluding the item to be removed.
        this.globalSelectedItems = this.globalSelectedItems.filter(item => item.value  != removeItem);
        const arrItems = this.globalSelectedItems;

        console.log('after removed globalSelectedItems',JSON.stringify(this.globalSelectedItems));

        //initialize values again
        // this.initializeValues();
        // this.value =[]; 

        // //propagate event to parent component
        // const evtCustomEvent = new CustomEvent('remove', {   
        //     detail: {removeItem,arrItems}
        //     });
        // this.dispatchEvent(evtCustomEvent);
    }
}