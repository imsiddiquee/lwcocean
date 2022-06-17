import { LightningElement } from 'lwc';

export default class LwclightningRecordForm extends LightningElement {
    handleShowChildElement()
    {     
        let button = this.template.querySelector(".btnSubmitForClient");        
        button.disabled = true;
        setTimeout(() => {
          button.disabled = false;        
        }, 3000);
    }
    
}