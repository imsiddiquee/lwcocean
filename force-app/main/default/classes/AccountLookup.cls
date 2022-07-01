public without sharing class AccountLookup {
    @AuraEnabled(cacheable=true)
    public static List<sObject> SearchData(string searchTerm, string myObject, string filter) {
        System.debug('searchTerm-->' + searchTerm);
        System.debug('myObject-->' + myObject);
        System.debug('filter-->' + filter);

        String myQuery = null;
        if (filter != null && filter != '') {
            myQuery =
                'Select Id, Name from ' +
                myObject +
                ' Where Name Like  \'%' +
                searchTerm +
                '%\' AND ' +
                filter +
                ' LIMIT  5';
        } else {
            if (searchTerm == null || searchTerm == '') {
                myQuery =
                    'Select Id, Name from ' +
                    myObject +
                    ' Where LastViewedDate != NULL ORDER BY LastViewedDate DESC LIMIT  5';
            } else {
                myQuery = 'Select Id, Name from ' + myObject + ' Where Name Like  \'%' + searchTerm + '%\' LIMIT  5';
            }
        }
        List<sObject> lookUpList = database.query(myQuery);
        System.debug('lookUpList-->' + JSON.serializePretty(lookUpList));
        return lookUpList;
    }

    @AuraEnabled(cacheable=true)
    public static string methodName() {
        try {
            System.debug('success');
            return 'success';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
