import { LightningElement, track, wire } from "lwc";
import { refreshApex } from "@salesforce/apex";
import getAccountList from "@salesforce/apex/AccountPaginationController.getAccountList";

export default class AccountPaginationList extends LightningElement {
    @track loader = false;
    @track error = null;
    @track pageSize = 10;
    @track pageNumber = 1;
    @track totalRecords = 0;
    @track totalPages = 0;
    @track recordEnd = 0;
    @track recordStart = 0;
    @track isPrev = true;
    @track isNext = true;
    @track accounts = [];

    pageListResponse;

    //On load
    connectedCallback() {
        //this.getAccounts();
    }

    //handle next
    handleNext() {
        this.loader = true;
        this.pageNumber = this.pageNumber + 1;
        refreshApex(this.pageListResponse).finally(() => (this.processing = false));
    }

    //handle prev
    handlePrev() {
        this.loader = true;
        this.pageNumber = this.pageNumber - 1;
        refreshApex(this.pageListResponse).finally(() => (this.processing = false));
    }

    @wire(getAccountList, { pageSize: "$pageSize", pageNumber: "$pageNumber" })
    wiredGetAccountList(response) {
        this.pageListResponse = response;

        let data = response.data;
        let error = response.error;

        if (data || error) {
            //this.processing = false;
            this.loader = true;
        }

        if (data) {
            this.loader = false;
            let resultData = JSON.parse(data);
            this.accounts = resultData.accounts;
            this.pageNumber = resultData.pageNumber;
            this.totalRecords = resultData.totalRecords;
            this.recordStart = resultData.recordStart;
            this.recordEnd = resultData.recordEnd;
            this.totalPages = Math.ceil(resultData.totalRecords / this.pageSize);
            this.isNext = this.pageNumber === this.totalPages || this.totalPages === 0;
            this.isPrev = this.pageNumber === 1 || this.totalRecords < this.pageSize;
        } else if (error) {
            console.log("error");
            this.loader = false;
        }
    }

    //get accounts
    // getAccounts() {
    //     getAccountList({ pageSize: pageSize, pageNumber: this.pageNumber })
    //         .then((result) => {
    //             this.loader = false;
    //             if (result) {
    //                 var resultData = JSON.parse(result);
    //                 this.accounts = resultData.accounts;
    //                 this.pageNumber = resultData.pageNumber;
    //                 this.totalRecords = resultData.totalRecords;
    //                 this.recordStart = resultData.recordStart;
    //                 this.recordEnd = resultData.recordEnd;
    //                 this.totalPages = Math.ceil(resultData.totalRecords / this.pageSize);
    //                 this.isNext = this.pageNumber == this.totalPages || this.totalPages == 0;
    //                 this.isPrev = this.pageNumber == 1 || this.totalRecords < this.pageSize;
    //             }
    //         })
    //         .catch((error) => {
    //             this.loader = false;
    //             this.error = error;
    //         });
    // }

    //display no records
    get isDisplayNoRecords() {
        var isDisplay = true;
        if (this.accounts) {
            if (this.accounts.length === 0) {
                isDisplay = true;
            } else {
                isDisplay = false;
            }
        }
        return isDisplay;
    }
}
