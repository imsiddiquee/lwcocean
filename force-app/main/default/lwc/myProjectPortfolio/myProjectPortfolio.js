import { LightningElement, track, api } from "lwc";

export default class MyProjectPortfolio extends LightningElement {
    @api details;

    isLoading = false;

    showModalBox(event) {
        this.isLoading = true;

        let selectedItem = this.details.find((p) => p.label === event.currentTarget.dataset.item);

        this.isLoading = false;
        this.template.querySelector("c-my-project-portfolio-description").details = selectedItem;
        this.template.querySelector("c-my-project-portfolio-description").showModal();
    }

    // hideModalBox() {
    //     this.isShowModal = false;
    // }
}
