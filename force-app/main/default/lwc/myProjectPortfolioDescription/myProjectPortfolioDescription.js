import { LightningElement, api, track } from "lwc";

export default class MyProjectPortfolioDescription extends LightningElement {
    @track isShowModal = false;
    @api details;

    // @api
    // get showModal() {
    //     console.log("get-showModal");
    //     this.isShowModal = true;
    //     return this.isShowModal;
    // }

    @api showModal() {
        console.log("show modal", JSON.stringify(this.details));
        this.isShowModal = true;
    }

    // showModalBox() {
    //     this.isShowModal = true;
    // }

    hideModalBox() {
        this.isShowModal = false;
    }
}
