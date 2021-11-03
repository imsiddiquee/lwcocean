import { LightningElement, track, wire } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";

//account schema
import RATING_FIELD from "@salesforce/schema/Account.Rating";
import TYPE_FIELD from "@salesforce/schema/Account.Type";
import getAllAccounts from "@salesforce/apex/AccountService.getAllAccounts";

// The delay used when debouncing event handlers before firing the event
const DELAY = 350;

const COLUMNS = [
    { label: "Id", fieldName: "Id" },
    { label: "Name", fieldName: "Name" },
    { label: "AccountNumber", fieldName: "AccountNumber" },
    { label: "Type", fieldName: "Type" },
    { label: "Rating", fieldName: "Rating" }
];

export default class AccountFilter extends LightningElement {
    columns = COLUMNS;

    @track
    filters = {};

    selectedAccountType;
    pageNumber = 1;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: RATING_FIELD
    })
    ratings;

    @wire(getPicklistValues, {
        recordTypeId: "012000000000000AAA",
        fieldApiName: TYPE_FIELD
    })
    accTypes;

    handleSearchKeyChange(event) {
        let searchByName = event.target.value;
        this.delayedFireFilterChangeEvent(searchByName);
    }

    delayedFireFilterChangeEvent(searchByName) {
        // Debouncing this method: Do not actually fire the event as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of Apex
        // method calls in components listening to this event.
        window.clearTimeout(this.delayTimeout);
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        this.delayTimeout = setTimeout(() => {
            // Published ProductsFiltered message
            this.filters.searchByName = searchByName;
            this.filters = { ...this.filters };
            console.log(JSON.stringify(this.filters));
        }, DELAY);
    }

    handleCheckboxChange(event) {
        if (!this.filters.ratings) {
            // Lazy initialize filters with all values initially set
            this.filters.ratings = this.ratings.data.values.map((item) => item.value);
        }
        const value = event.target.dataset.value;
        const filterArray = this.filters[event.target.dataset.filter];
        if (event.target.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
            }
        } else {
            this.filters[event.target.dataset.filter] = filterArray.filter((item) => item !== value);
        }
        this.filters = { ...this.filters };

        console.log(JSON.stringify(this.filters));
        //this.getTestAllAccounts();
    }
    handleTypeChange(event) {
        this.filters.types = event.target.value;
        this.filters = { ...this.filters };
        console.log(JSON.stringify(this.filters));
    }

    @wire(getAllAccounts, { filters: "$filters", currentPageNumber: "$pageNumber" })
    filteredAccounts;
}
