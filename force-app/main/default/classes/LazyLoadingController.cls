public with sharing class LazyLoadingController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(Integer limitSize, Integer offset) {
        System.debug('limitSize-->' + limitSize);
        System.debug('offset-->' + offset);
        List<Account> accountList = [
            SELECT Id, Name, Rating
            FROM Account
            ORDER BY CreatedDate
            LIMIT :limitSize
            OFFSET :offset
        ];
        return accountList;
    }

    @AuraEnabled(cacheable=true)
    public static PagedResult getAccountAllData(Integer limitSize, Integer offset, String objName) {
        System.debug('limitSize-->' + limitSize);
        System.debug('offset-->' + offset);
        System.debug('objName-->' + objName);

        PagedResult result = new PagedResult();
        result.totalItemCount = Database.countQuery('SELECT count() FROM ' + objName);
        result.records = [SELECT Id, Name, Rating FROM Account ORDER BY CreatedDate LIMIT :limitSize OFFSET :offset];
        System.debug('object list-->' + result);
        return result;
    }

    public class PagedResult {
        @AuraEnabled
        public Integer totalItemCount { get; set; }

        @AuraEnabled
        public Object[] records { get; set; }
    }
}
