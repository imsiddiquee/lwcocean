@isTest
public class TestAccountService {
    @TestSetup
    static void createAccounts() {
        List<Account> accList = new List<Account>();
        accList.add(new Account(Name = 'sample acc 1', Rating = 'Hot', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 2', Rating = 'Cold', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 3', Rating = 'Cold', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 4', Rating = 'Cold', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 5', Rating = 'Cold', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 6', Rating = 'Cold', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 7', Rating = 'Warm', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 8', Rating = 'Warm', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 9', Rating = 'Warm', Type = 'Prospect'));
        accList.add(new Account(Name = 'sample acc 10', Rating = 'Hot', Type = 'Prospect'));

        insert accList;
    }

    @isTest
    private static void testGetAccounts() {
        AccountService.Filters filters = new AccountService.Filters();
        filters.searchByName = 'Sample';
        //filters.ratings = new List<String>{ 'Hot' };
        //filters.types = new List<String>{ 'Prospect' };
        PagedResult result = AccountService.getAccounts(filters, 1);
        System.debug(result.records[0]);
        System.assertEquals(result.records.size(), 5);
    }

    @isTest
    private static void testGetAccountsByName() {
        AccountService.Filters filters = new AccountService.Filters();
        filters.searchByName = 'Sample';
        filters.ratings = new List<String>{ 'Hot' };
        //filters.types = new List<String>{ 'Prospect' };
        PagedResult result = AccountService.getAllAccounts(filters, 1);
        System.debug(result.records.size());
        System.assertEquals(result.records.size(), 5);
    }
}
