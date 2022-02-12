import { LightningElement } from "lwc";

export default class MySserviceTileList extends LightningElement {
    showBack = false;
    handleShowElement(event) {
        this.removedCss();
        let targetId = event.target.dataset.targetId;

        //let targetId = event.target.dataset.targetId;
        //let target = this.template.querySelector(`[data-id="${targetId}"]`);
        this.addClass(targetId);
        this.showBack = true;

        console.log("targetId-->", targetId);
    }

    removedCss() {
        console.log("test-->", this.template.querySelectorAll(".showElement"));
        //this.template.querySelector("div").classList.remove("showDiv");
        //this.template.querySelector(".showDiv").classList.remove("showDiv");
        //this.template.querySelectorAll(".showDiv").forEach((e) => e.remove());

        this.template.querySelectorAll(".showElement").forEach((e) => e.classList.add("hideElement"));
        this.template.querySelectorAll(".showElement").forEach((e) => e.classList.remove("showElement"));
    }

    addClass(targetId) {
        this.template.querySelector(`[data-id="${targetId}"]`).classList.remove("hideElement");
        this.template.querySelector(`[data-id="${targetId}"]`).classList.add("showElement");
    }

    handleBack(event) {
        this.removedCss();
        this.showBack = false;

        this.addClass("myDashboard");
    }
}
