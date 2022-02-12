import { LightningElement } from "lwc";

export default class AddRemovedCss extends LightningElement {
    handleClick(event) {
        this.removedCss();
        let targetId = event.target.dataset.targetId;

        //let targetId = event.target.dataset.targetId;
        //let target = this.template.querySelector(`[data-id="${targetId}"]`);
        this.addClass(targetId);

        console.log("targetId-->", targetId);
    }
    removedCss() {
        console.log("test-->", this.template.querySelectorAll(".showDiv"));
        //this.template.querySelector("div").classList.remove("showDiv");
        //this.template.querySelector(".showDiv").classList.remove("showDiv");
        //this.template.querySelectorAll(".showDiv").forEach((e) => e.remove());

        this.template.querySelectorAll(".showDiv").forEach((e) => e.classList.remove("showDiv"));
    }

    addClass(targetId) {
        //this.template.querySelector(`[data-id="${targetId}"]`).classList.add("showDiv");
        this.template.querySelector(`[data-target-id="${targetId}"]`).classList.add("showDiv");
    }
}
