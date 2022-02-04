public with sharing class AccountFetcherCleanCode {
    //process-1
    private String contactType = 'Client';
    private String accountType = 'Priority';

    public List<String> getPriorityAccountBilllingStates() {
        List<Contact> contacts = getClientContacts();
        List<Id> accountIds = getUniqueAccountIds(contacts);
        List<Account> allAccounts = getPriorityAccounts(accountIds);

        return getBillingStates(allAccounts);
    }

    private List<Contact> getClientContacts() {
        return [SELECT ID, firstName, lastName, accountId FROM CONTACT WHERE type__c = :contactType];
    }

    private List<Id> getUniqueAccountIds(List<Contact> allContacts) {
        Set<Id> uniqueAccountIds = new Set<Id>();
        for (Contact c : allContacts) {
            uniqueAccountIds.add(c.AccountId);
        }
        return new List<Id>(uniqueAccountIds);
    }

    private List<Account> getPriorityAccounts(List<Id> uniqueAccountIds) {
        return [SELECT Id FROM Account WHERE Id IN :uniqueAccountIds AND type = :accountType];
    }

    private List<String> getBillingStates(List<Account> allAccounts) {
        Set<String> billingState = new Set<String>();
        for (Account a : allAccounts) {
            billingState.add(a.BillingState);
        }
        return new List<String>(billingState);
    }

    //process-2
    private void setCategory(List<Sales__c> newSales) {
        for (Sales__c s : newSales) {
            s.Sales_Category__c = getCategory(s.Amount__c);
        }
    }

    public String getCategory(Decimal amount) {
        String category;
        if (amount < 1000) {
            category = 'Small';
        } else if (amount < 10000) {
            category = 'Medium';
        } else if (amount < 50000) {
            category = 'Large';
        } else if (amount > 50000) {
            category = 'Extra Large';
        }

        return category;
    }

    //process-3

    public void handleAuditFieldCnages(List<Sales__c> newSales, Map<Id, Sales__c> oldMap) {
        for (Sale__c s : newSales) {
            if (s.Audit_Complete__c == true) {
                setAuditFields(s);
            } else {
                clearAuditFields(s);
            }
        }
    }

    private void setAuditFields(Sales__c s) {
        s.Audit_Completed_Time__c = system.now();
        s.Auditor__c = UserInfo.getUserId();
    }

    private void clearAuditFields(Sales__c s) {
        s.Audit_Completed_Time__c = null;
        s.Auditor__c = null;
    }

    //process-4

    public void handleBeforeUpdate(List<Sales__c> newSales) {
        setCategory(newSales);
    }

    public void handleBeforeInsert(List<Sales__c> newSales) {
        setCategory(newSales);
    }

    //process-5
    //avoid hardcoded string
    private final String PURCHASE_ORDER = 'Purchase Order';
    private void avoidHardCodedString() {
        if (paymentType == 'Purchase Order') {
            doPurchaseOrderProcessing();
        }

        if (paymentType == PURCHASE_ORDER) {
            doPurchaseOrderProcessing();
        }
    }

    //process-5

    private final String DATE_FORMAT_STRING = 'dd MMM yyyy';
    private void avoidRepeatedString() {
        Datetime dt = Datetime.newInstance(eDate.year(), eDate.month(), eDate.day());
        String formattedDate = dt.format('d MMM yyyy');
        String formattedDate = dt.format(DATE_FORMAT_STRING);
    }

    //process-6

    private void extractIfCondition() {
        if (accountIsSpecial(acct)) {
            assignToSpecialTeam();
        }
    }
    private Boolean accountIsSpecial(Account acc) {
        return acc.AnnualRevenue >= 100000 && acc.Active__c == 'Yes' && acc.BillingState == 'MD';
    }

    //process-7
    private void simplifyForEaseOfReading() {
        Boolean boxWasUnchecked = oldRecord.Audit_Completed__c == true && newRecord.Audit_Completed__c == false;
        Boolean salesIsActiveAndOpen = oldRecord.Audit_Completed__c == true && newRecord.Status__c == 'Open';

        if (boxWasUnchecked && salesIsActiveAndOpen) {
            //do something
        }
    }
}
