public with sharing class AccountPaginationController {
    @AuraEnabled //Get Account Records
    public static String getAccountList(Integer pageSize, Integer pageNumber) {
        String jsonDT = '';

        //Offset for SOQL
        Integer offset = (pageNumber - 1) * pageSize;

        //Total Records
        Integer totalRecords = [SELECT COUNT() FROM Account];
        Integer recordEnd = pageSize * pageNumber;

        AccountDTWrapper objDT = new AccountDTWrapper();
        objDT.pageSize = pageSize;
        objDT.pageNumber = pageNumber;
        objDT.recordStart = offset + 1;
        objDT.recordEnd = totalRecords >= recordEnd ? recordEnd : totalRecords;
        objDT.totalRecords = totalRecords;
        objDT.accounts = [SELECT Id, Name, AccountNumber, Industry, Phone FROM Account LIMIT :pageSize OFFSET :offset];
        jsonDT = JSON.serialize(objDT);
        return jsonDT;
    }

    public class AccountDTWrapper {
        public Integer pageSize { get; set; }
        public Integer pageNumber { get; set; }
        public Integer totalRecords { get; set; }
        public Integer recordStart { get; set; }
        public Integer recordEnd { get; set; }
        public List<Account> accounts { get; set; }
    }
}
