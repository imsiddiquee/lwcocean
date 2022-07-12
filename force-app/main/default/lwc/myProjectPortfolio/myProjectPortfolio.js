import { LightningElement, track, api } from "lwc";

export default class MyProjectPortfolio extends LightningElement {
    @api details;

    showModalBox(event) {
        //console.log("event-->", this.details[0].id);
        // console.log("event-->", event.currentTarget.dataset.id);
        // console.log("event-->", event.currentTarget.dataset.item.id);
        // console.log("event-->", JSON.parse(event.currentTarget.dataset.item));
        // console.log("event-->", event.target.dataset);

        let selectedItem = this.details.find((p) => p.label === event.currentTarget.dataset.item);

        console.log("show modal box", selectedItem);
        //this.isShowModal = true;

        this.template.querySelector("c-my-project-portfolio-description").details = selectedItem;
        this.template.querySelector("c-my-project-portfolio-description").showModal();
    }

    // hideModalBox() {
    //     this.isShowModal = false;
    // }
}
