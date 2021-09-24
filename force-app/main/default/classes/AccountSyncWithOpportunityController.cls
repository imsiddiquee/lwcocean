public with sharing class AccountSyncWithOpportunityController {
    public AccountSyncWithOpportunityController() {

    }

    @AuraEnabled
    public static List<AccountOpportunityWrapper> getLatestOpportunityRelatedAccounts(){
        try {

            List<AccountOpportunityWrapper> accounts=new List<AccountOpportunityWrapper>();

            for(Account accObj:
                    [
                        SELECT Id, 
                        Name,
                        Opportunity_Amount__c,
                        Monthly_Recurring_Revenue__c,
                        Annual_Recurring_Revenue__c,
                        Active__c,
                        (
                            SELECT Id,
                            Name,
                            AccountId,                            
                            StageName,
                            Amount,
                            Monthly_Recurring_Revenue__c,
                            Annual_Recurring_Revenue__c,
                            format(CloseDate),
                            format(LastModifiedDate),
                            CreatedBy.Name,
                            LastModifiedBy.Name
                            FROM Opportunities
                            WHERE StageName='Closed Won' ORDER BY LastModifiedDate DESC limit 1
                        ) 
                        FROM Account 
                        WHERE Active__c=true
                        ORDER BY Name
                    ]
                )

            {
                accounts.add(new AccountOpportunityWrapper(accObj));
                
            }

            return accounts;            
            
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }

    @AuraEnabled
    public static String syncLatestOpportunityWithAccounts(List<AccountOpportunityWrapper> accounts){
        map<id,Account> latestOppAccountMap = new map<id,Account>();        
        String responseMessage='Success';

       try {
        for (AccountOpportunityWrapper currentAccount : accounts) {
            Account acc=new Account();
            acc.Id=currentAccount.accountId;
            acc.Opportunity_Amount__c=currentAccount.opportunityAmount;
            acc.Monthly_Recurring_Revenue__c=currentAccount.opportunityMRR;
            acc.Annual_Recurring_Revenue__c=currentAccount.opportunityARR;
            acc.Description='MRR,ARR,Amount sync with latest opportunity by auto process.';

            if (!latestOppAccountMap.containsKey(acc.Id)) {
                latestOppAccountMap.put(acc.Id, acc);                
            }
            
        }

        if(latestOppAccountMap.size()>0)
        {
            update latestOppAccountMap.values();
        }

       } catch (Exception ex) {
        responseMessage='failed '+ex.getMessage();
        //throw new AuraHandledException(ex.getMessage());
    }

    return responseMessage;
       
    }

    public with sharing class AccountOpportunityWrapper {
        @AuraEnabled
        public String accountId {get;set;}
        @AuraEnabled
        public String accountName {get;set;}
        @AuraEnabled
        public Decimal accountAmount {get;set;}
        @AuraEnabled
        public Decimal accountMRR {get;set;}
        @AuraEnabled
        public Decimal accountARR {get;set;}
        @AuraEnabled
        public String accountActive {get;set;}

        @AuraEnabled
        public String opportunityId {get;set;}
        @AuraEnabled
        public String opportunityName {get;set;}
        @AuraEnabled
        public String opportunityStageName {get;set;}
        @AuraEnabled
        public Decimal opportunityAmount {get;set;}
        @AuraEnabled
        public Decimal opportunityMRR {get;set;}
        @AuraEnabled
        public Decimal opportunityARR {get;set;}
        @AuraEnabled
        public String opportunityCloseDate {get;set;}
        @AuraEnabled
        public String opportunityLastModifiedDate {get;set;}
        @AuraEnabled
        public String CreatedBy {get;set;}
        @AuraEnabled
        public String LastModifiedBy {get;set;}

        public AccountOpportunityWrapper()
        {

        }

        public AccountOpportunityWrapper(Account currentAccount)
        {
            this.accountId=currentAccount.Id;
            this.accountName=currentAccount.Name;
            this.accountAmount=String.isBlank(String.valueOf(currentAccount.Opportunity_Amount__c))?0:currentAccount.Opportunity_Amount__c;
            this.accountMRR=String.isBlank(String.valueOf(currentAccount.Monthly_Recurring_Revenue__c))?0:currentAccount.Monthly_Recurring_Revenue__c;
            this.accountARR=String.isBlank(String.valueOf(currentAccount.Annual_Recurring_Revenue__c))?0:currentAccount.Annual_Recurring_Revenue__c;
            this.accountActive=String.valueOf(currentAccount.Active__c);

            if(currentAccount.Opportunities.size()>0){
                Opportunity relatedOpp = currentAccount.Opportunities[0];

                this.opportunityId=relatedOpp.Id;
                this.opportunityName=relatedOpp.Name;
                
                this.opportunityStageName= relatedOpp.StageName;
                this.opportunityAmount= String.isBlank(String.valueOf(relatedOpp.Amount))?0:relatedOpp.Amount;
                this.opportunityMRR= String.isBlank(String.valueOf(relatedOpp.Monthly_Recurring_Revenue__c))?0:relatedOpp.Monthly_Recurring_Revenue__c;
                this.opportunityARR=String.isBlank(String.valueOf(relatedOpp.Annual_Recurring_Revenue__c))?0:relatedOpp.Annual_Recurring_Revenue__c;
                this.opportunityCloseDate=String.valueOf(relatedOpp.CloseDate);
                this.opportunityLastModifiedDate=String.valueOf(relatedOpp.LastModifiedDate);
                this.CreatedBy= relatedOpp.CreatedBy.Name;
                this.LastModifiedBy= relatedOpp.LastModifiedBy.Name;
            }
        }       
        
    }
}