public with sharing class AccountService {
    public static void contactCreateFromAccountInfo(List<Account> newRecordsList) {
        List<Contact> contactList = new List<Contact>();

        for (Account acc : newRecordsList) {
            Contact conObject = new Contact();
            conObject.AccountId = acc.Id;
            conObject.LastName = acc.Name;
            contactList.add(conObject);
        }
        if (!contactList.isEmpty()) {
            insert contactList;
        }

        System.debug('contactCreateFromAccountInfo');
    }

    public static void opportunityCreateFromAccountInfo(
        Map<Id, Account> existingRecorMap,
        Map<Id, Account> oldRecorMap
    ) {
        List<Opportunity> oppList = new List<Opportunity>();

        for (Account acc : existingRecorMap.values()) {
            if ((acc.Rating != oldRecorMap.get(acc.Id).Rating) && acc.Rating == 'Warm') {
                Opportunity opp = new Opportunity();
                opp.AccountId = acc.Id;
                opp.Name = acc.Name;
                opp.StageName = 'Prospecting';
                opp.CloseDate = System.today();
                oppList.add(opp);
            }
        }
        if (!oppList.isEmpty()) {
            insert oppList;
        }
    }

    public static void updateAccountFileInsert(List<ContentDocumentLink> docList) {
        Map<Id, Account> accMap = new Map<Id, Account>();

        Set<Id> accIdsSet = new Set<Id>();
        for (ContentDocumentLink docLink : docList) {
            if (docLink.LinkedEntityId != null && String.valueOf(docLink.LinkedEntityId).startsWithIgnoreCase('001')) {
                accIdsSet.add(docLink.LinkedEntityId);
            }
        }

        if (accIdsSet.size() > 0) {
            for (AggregateResult agrObj : [
                SELECT COUNT(Id) flCount, LinkedEntityId
                FROM ContentDocumentLink
                WHERE LinkedEntityId IN :accIdsSet
                GROUP BY LinkedEntityId
            ]) {
                Account acc = new Account();
                acc.Id = (Id) agrObj.get('LinkedEntityId');
                acc.Description = String.valueOf(agrObj.get('flCount'));
                accMap.put(acc.Id, acc);
            }
        }

        if (!accMap.isEmpty()) {
            update accMap.values();
        }
    }

    static Integer PAGE_SIZE = 5;
    public class Filters {
        @AuraEnabled
        public String searchByName { get; set; }
        @AuraEnabled
        public String[] ratings { get; set; }
        @AuraEnabled
        public String[] types { get; set; }
    }

    ///static soql retrived all records base on conditions
    @AuraEnabled(cacheable=true)
    public static PagedResult getAccounts(Filters filters, Integer currentPageNumber) {
        //filter
        String currentSearchByName = '%%';
        if (String.isNotBlank(filters.searchByName)) {
            currentSearchByName = '%' + filters.searchByName + '%';
        }

        //get page-size and offset
        Integer eachPageSize = AccountService.PAGE_SIZE;
        Integer offset = (currentPageNumber - 1) * eachPageSize;
        //get result
        PagedResult result = new PagedResult();
        result.pageSize = eachPageSize;
        result.pageNumber = currentPageNumber;
        result.totalItemCount = [SELECT COUNT() FROM Account];
        result.records = [
            SELECT Id, Name, AccountNumber, Industry, Ownership, Type, CreatedById, LastModifiedById
            FROM Account
            //WHERE Name LIKE :currentSearchByName AND Rating IN :filters.ratings AND  Type IN :filters.types
            WHERE Name LIKE :currentSearchByName
            WITH SECURITY_ENFORCED
            ORDER BY Name
            LIMIT :eachPageSize
            OFFSET :offset
        ];

        return result;
    }

    ///dynamic soql retrived all records base on conditions
    @AuraEnabled(cacheable=true)
    public static PagedResult getAllAccounts(Filters filters, Integer currentPageNumber) {
        //filter
        String currentSearchByName, whereClause = '';
        String[] currentRatings, currentTypes, criteria = new List<String>{};

        if (filters != null) {
            if (String.isNotBlank(filters.searchByName)) {
                currentSearchByName = '%' + filters.searchByName + '%';
                criteria.add('Name LIKE :currentSearchByName');
            }

            if (filters.ratings != null) {
                currentRatings = filters.ratings;
                criteria.add('Rating IN :currentRatings');
            }

            if (filters.types != null) {
                currentTypes = filters.types;
                criteria.add('Type IN :currentTypes');
            }

            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
                System.debug(whereClause);
            }
        }

        //get page-size and offset
        Integer eachPageSize = AccountService.PAGE_SIZE;
        Integer offset = (currentPageNumber - 1) * eachPageSize;
        //get result
        PagedResult result = new PagedResult();
        result.pageSize = eachPageSize;
        result.pageNumber = currentPageNumber;
        result.totalItemCount = Database.countQuery('SELECT count() FROM Account ' + whereClause);
        result.records = Database.query(
            'SELECT Id, Name, AccountNumber, Industry, Ownership, Type, CreatedById, LastModifiedById FROM Account ' +
            whereClause +
            ' WITH SECURITY_ENFORCED' +
            ' ORDER BY Name LIMIT :eachPageSize OFFSET :offset'
        );

        return result;
    }
}
