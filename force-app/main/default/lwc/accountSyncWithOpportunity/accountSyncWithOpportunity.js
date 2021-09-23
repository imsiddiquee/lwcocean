import { LightningElement, wire } from "lwc";
import getLatestOpportunityRelatedAccounts from "@salesforce/apex/AccountSyncWithOpportunityController.getLatestOpportunityRelatedAccounts";
import syncLatestOpportunityWithAccounts from "@salesforce/apex/AccountSyncWithOpportunityController.syncLatestOpportunityWithAccounts";

const COLUMNS = [
  {
    label: "Acc Id",
    fieldName: "accountId",
    initialWidth: 80
  },
  {
    label: "Name",
    fieldName: "accountName",
    initialWidth: 80,
    wrapText: true
  },
  {
    label: "Amount",
    fieldName: "accountAmount",
    type: "currency",
    initialWidth: 140,
    cellAttributes: {
      alignment: "left",
      class: { fieldName: "amountColor" },
      iconName: { fieldName: "iconName" },
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
      iconName: { fieldName: "iconName" },
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
      iconName: { fieldName: "iconName" },
      iconPosition: "right"
    }
  },
  { label: "Is Active", fieldName: "accountActive", initialWidth: 100 },

  { label: "Opp Id", fieldName: "opportunityId", initialWidth: 80 },
  {
    label: "Name",
    fieldName: "opportunityName",
    initialWidth: 100,
    wrapText: true
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
      iconName: { fieldName: "iconName" },
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
      iconName: { fieldName: "iconName" },
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
      iconName: { fieldName: "iconName" },
      iconPosition: "right"
    }
  },
  { label: "Close Date", fieldName: "opportunityCloseDate", initialWidth: 100 },
  {
    label: "Last Modified Date",
    fieldName: "opportunityLastModifiedDate",
    initialWidth: 150
  },
  { label: "Created By", fieldName: "CreatedBy", initialWidth: 120 },
  { label: "Modified By", fieldName: "LastModifiedBy", initialWidth: 120 }
];
export default class AccountSyncWithOpportunity extends LightningElement {
  accountData = [];

  accountColumns = COLUMNS;
  syncMessage = "";

  @wire(getLatestOpportunityRelatedAccounts)
  retrivedLatestOpportunityRelatedAccounts(response) {
    let data = response.data;
    let error = response.error;

    if (data || error) {
      // this.processing = false;
    }

    if (data) {
      this.accountData = data;

      this.accountData = data.map((item) => {
        let amountColor =
          item.accountAmount !== item.opportunityAmount
            ? "slds-text-color_error"
            : "slds-text-color_success";

        let mrrColor =
          item.accountMRR !== item.opportunityMRR
            ? "slds-text-color_error"
            : "slds-text-color_success";

        let arrColor =
          item.accountARR !== item.opportunityARR
            ? "slds-text-color_error"
            : "slds-text-color_success";

        let iconName =
          item.accountAmount !== item.opportunityAmount
            ? "utility:info"
            : "utility:success";
        return {
          ...item,
          amountColor: amountColor,
          mrrColor: mrrColor,
          arrColor: arrColor,
          iconName: iconName,
          industryColor: "slds-icon-custom-custom12 slds-text-color_default",
          accountColor: "datatable-orange"
        };
      });

      console.log("data", data);
    } else if (error) {
      console.log("getUserReports");
    }
  }

  handleSync() {
    console.log("handleSync");
    syncLatestOpportunityWithAccounts({ accounts: this.accountData })
      .then((response) => {
        this.syncMessage = response;
      })
      .catch((error) => {
        console.log(error.body.message);
      });
  }
}
