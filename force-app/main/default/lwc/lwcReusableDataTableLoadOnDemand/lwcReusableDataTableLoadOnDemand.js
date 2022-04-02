import { LightningElement, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import getAccountAllData from "@salesforce/apex/LazyLoadingController.getAccountAllData";

// const COLUMNS = [
//     { label: "Id", fieldName: "Id", type: "text" },
//     { label: "Name", fieldName: "Name", type: "text" },
//     { label: "Rating", fieldName: "Rating", type: "text" }
// ];

const COLUMNS = [
    { label: "Id", fieldName: "id", type: "text" },
    { label: "Name", fieldName: "name", type: "text" },
    { label: "Rating", fieldName: "rating", type: "text" }
];

export default class LwcReusableDataTableLoadOnDemand extends LightningElement {
    accounts = [];
    error;
    columns = COLUMNS;
    rowLimit = 5;
    rowOffSet = 0;
    accResponse;
    isProcessing = true;
    manageLoadOnDemand = true;
    tableElement;
    totalItemCount;
    loadMoreStatus;
    selectedItems;

    connectedCallback() {
        this.loadData();
    }

    loadData() {
        return getAccountAllData({ limitSize: this.rowLimit, offset: this.rowOffSet, objName: "Account" })
            .then((result) => {
                this.formatData(result.records);
                this.totalItemCount = result.totalItemCount;

                this.loadMoreStatus = "";
                this.error = undefined;
                this.isProcessing = false;
            })
            .catch((error) => {
                this.error = error;
                this.accounts = undefined;
                this.isProcessing = false;
            });
    }

    loadMoreData(event) {
        const { target } = event;
        target.isLoading = true;

        this.tableElement = event.target;

        if (this.accounts.length >= this.totalItemCount) {
            this.tableElement.enableInfiniteLoading = false;
            target.isLoading = false;
            this.loadMoreStatus = "No more data to load";
        } else {
            this.rowOffSet = this.rowOffSet + this.rowLimit;
            console.log("rowOffSet-->", this.rowOffSet);
            this.loadData().then(() => {
                target.isLoading = false;
            });
        }
    }

    formatData(response) {
        let result = response.map((item, index) => {
            let id = item.Id;
            let name = item.Name;
            let rating = item.Rating;
            return { ...item, id: id, name: name, rating: rating };
        });

        let tempResult = [...this.accounts, ...result];
        this.accounts = tempResult;
    }

    getSelectedName(event) {
        // const selectedRows = event.detail.selectedRows;
        // console.log("selectedRows-->", selectedRows);
        // // Display that fieldName of the selected rows
        // for (let i = 0; i < selectedRows.length; i++) {
        //     // alert('You selected: ' + selectedRows[i].opportunityName);
        // }

        this.selectedItems = event.detail.selectedRows.length;
    }
}
