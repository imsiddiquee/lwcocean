public without sharing class AccountSearchController {
    public AccountSearchController() {
    }
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String actName) {
        System.debug('getAccounts');
        List<Account> accountList = new List<Account>();
        if (actName != '') {
            String accountName = '%' + actName + '%';
            accountList = [SELECT id, name FROM Account WHERE name LIKE :accountName];
            return accountList;
        }

        return accountList;
    }

    @AuraEnabled(cacheable=true)
    public static String getLookupDetails(String sObjectName, String actName) {
        System.debug('getLookupDetails');
        if (actName != '') {
            String accountName = '%' + actName + '%';
            String queryString = String.format(
                'SELECT Id, Name FROM {0} WHERE name LIKE :accountName LIMIT 10',
                new List<String>{ sObjectName }
            );
            //List<sObject> lstOfRecords = Database.query(queryString);
            //System.debug('lstOfRecords-->' + lstOfRecords);

            return JSON.serialize(Database.query(queryString));
        }

        return '';
    }
}
