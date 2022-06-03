import { api, LightningElement, track, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import getLatestOpportunityRelatedAccounts from "@salesforce/apex/AccountSyncWithOpportunityController.getLatestOpportunityRelatedAccounts";
import syncLatestOpportunityWithAccounts from "@salesforce/apex/AccountSyncWithOpportunityController.syncLatestOpportunityWithAccounts";
import refreshGridDummy from "@salesforce/apex/AccountSyncWithOpportunityController.refreshGridDummy";

/***
 *
This component has child component dependency
First, need to deploy the below components
ldsUtils
paginator
reusableDataTableWithPreselect
 * 

Account object should have below fields

    Opportunity_Amount__c,
    Monthly_Recurring_Revenue__c,
    Annual_Recurring_Revenue__c,
    Active2__c,
    Client_Success_Manager__c,
    Client_Success_Manager__r.Name,
**
**
**
Opportunity object should have below fields

    Monthly_Recurring_Revenue__c,
    Annual_Recurring_Revenue__c,
 */

const BASE_URL = `https://${window.location.hostname}/`;

const COLUMNS = [
    {
        label: "Exist Acc Name",
        fieldName: "accountUrl",
        wrapText: true,
        initialWidth: 100,
        type: "url",
        typeAttributes: {
            label: {
                fieldName: "accountName"
            },
            tooltip: "Exist Acc Name",
            target: "_blank"
        }
    },
    {
        label: "Amount",
        fieldName: "accountAmount",
        type: "currency",
        initialWidth: 140,
        cellAttributes: {
            alignment: "left",
            class: { fieldName: "amountColor" },
            iconName: { fieldName: "amountIconName" },
            iconPosition: "right"
        }
    },
    {
        label: "MRR",
        fieldName: "accountMRR",
        type: "currency",
        initialWidth: 140,
        cellAttributes: {
            alignment: "left",
            class: { fieldName: "mrrColor" },
            iconName: { fieldName: "mrrIconName" },
            iconPosition: "right"
        }
    },
    {
        label: "ARR",
        fieldName: "accountARR",
        type: "currency",
        initialWidth: 140,
        cellAttributes: {
            alignment: "left",
            class: { fieldName: "arrColor" },
            iconName: { fieldName: "arrIconName" },
            iconPosition: "right"
        }
    },
    { label: "Is Active", fieldName: "accountActive", initialWidth: 100 },

    {
        label: "Opp Name",
        fieldName: "oppUrl",
        wrapText: true,
        initialWidth: 100,
        type: "url",
        typeAttributes: {
            label: {
                fieldName: "opportunityName"
            },
            tooltip: "Opp Name",
            target: "_blank"
        }
    },
    { label: "Stage", fieldName: "opportunityStageName", initialWidth: 80 },
    {
        label: "Amount",
        fieldName: "opportunityAmount",
        type: "currency",
        initialWidth: 140,
        cellAttributes: {
            alignment: "left",
            class: { fieldName: "amountColor" },
            iconName: { fieldName: "amountIconName" },
            iconPosition: "right"
        }
    },
    {
        label: "MRR",
        fieldName: "opportunityMRR",
        type: "currency",
        initialWidth: 140,
        cellAttributes: {
            alignment: "left",
            class: { fieldName: "mrrColor" },
            iconName: { fieldName: "mrrIconName" },
            iconPosition: "right"
        }
    },
    {
        label: "ARR",
        fieldName: "opportunityARR",
        type: "currency",
        initialWidth: 140,
        cellAttributes: {
            alignment: "left",
            class: { fieldName: "arrColor" },
            iconName: { fieldName: "arrIconName" },
            iconPosition: "right"
        }
    },
    { label: "Close Date", fieldName: "opportunityCloseDate", initialWidth: 100 },
    {
        label: "Last Modified Date",
        fieldName: "opportunityLastModifiedDate",
        initialWidth: 150
    },
    { label: "Created By", fieldName: "createdBy", initialWidth: 120 },
    { label: "Modified By", fieldName: "lastModifiedBy", initialWidth: 120 },
    {
        label: "Cli Succ Manager",
        fieldName: "clientSuccessManager",
        typeAttributes: {
            tooltip: "Client Success Manager"
        },
        initialWidth: 140
    }
];
export default class AccountSyncWithOpportunity extends LightningElement {
    @api componentTitle = "Account Sync";

    @track
    wiredResult = [];

    @track
    accountData = [];

    accountColumns = COLUMNS;
    syncMessage = "";
    showLoadingSpinner = false;
    wiredResponse;

    showToastMessage(variant, message) {
        const toastEvnt = new ShowToastEvent({
            title: "Sync process complete",
            message: message,
            variant: variant
        });
        this.dispatchEvent(toastEvnt);
    }

    handleSync() {
        this.showLoadingSpinner = true;

        let selectedRows = this.template.querySelector('[data-id="accountSyncGrid"]').getRows();

        syncLatestOpportunityWithAccounts({ accounts: selectedRows })
            .then((response) => {
                if (response === "Success") {
                    this.showToastMessage("success", `With success,total sync ${selectedRows.length} records.`);
                } else {
                    this.showToastMessage("error", `With errors reason for ${response}`);
                }
            })
            .catch((error) => {
                console.log(error.body.message);
            })
            .finally(() => {
                //this.processing = false;
                this.fillGridData();
            });
    }

    @wire(getLatestOpportunityRelatedAccounts)
    wiredGetLatestOpportunityRelatedAccounts(response) {
        this.showLoadingSpinner = true;
        this.wiredResponse = response;
        //console.log("wiredGetLatestOpportunityRelatedAccounts");

        let data = response.data;
        let error = response.error;

        if (data || error) {
            this.showLoadingSpinner = false;
        }
        this.wiredResult = [];

        if (data) {
            this.wiredResult = data.accList.map((item) => {
                let accountUrl = BASE_URL + item.accountId;
                let oppUrl = BASE_URL + item.opportunityId;
                let amountColor =
                    item.accountAmount !== item.opportunityAmount ? "slds-text-color_error" : "slds-text-color_success";

                let mrrColor =
                    item.accountMRR !== item.opportunityMRR ? "slds-text-color_error" : "slds-text-color_success";

                let arrColor =
                    item.accountARR !== item.opportunityARR ? "slds-text-color_error" : "slds-text-color_success";

                let amountIconName = item.accountAmount !== item.opportunityAmount ? "utility:info" : "utility:success";

                let mrrIconName = item.accountMRR !== item.opportunityMRR ? "utility:info" : "utility:success";

                let arrIconName = item.accountARR !== item.opportunityARR ? "utility:info" : "utility:success";

                return {
                    ...item,
                    id: item.accountId,
                    accountUrl: accountUrl,
                    oppUrl: oppUrl,
                    amountColor: amountColor,
                    mrrColor: mrrColor,
                    arrColor: arrColor,
                    amountIconName: amountIconName,
                    mrrIconName: mrrIconName,
                    arrIconName: arrIconName
                };
            });
        } else if (error) {
            console.log("error");
        }
    }

    handleLoadAccountRelatedLatestOpportunity() {
        this.showLoadingSpinner = true;
        this.fillGridData();
    }
    fillGridData() {
        refreshApex(this.wiredResponse).finally(() => {
            this.accountData = this.wiredResult;
            this.showLoadingSpinner = false;
        });
    }

    handleRefresh() {
        this.showLoadingSpinner = true;
        this.accountData = [];
        refreshGridDummy()
            .then(() => {
                refreshApex(this.wiredResponse);
                this.accountData = this.wiredResult;
            })
            .catch((error) => {
                console.log(error.body.message);
            })
            .finally(() => {
                this.showLoadingSpinner = false;
            });
    }
}
