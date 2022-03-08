public with sharing class VFC_DomainsController {
    public string lexOrigin {
        get {
            return URL.getOrgDomainUrl().toExternalForm().split('.my.')[0] + '.lightning.force.com';
            // Exprcted outcome for Developer Orgs & Sandbox https://your-domain-dev-ed.lightning.force.com/
            // Expected outcome for Prod Org - https://your-domain.my.lightning.force.com/
        }
        set;
    }

    @AuraEnabled(cacheable=true)
    public static string getVisualforceOrigin() {
        string visualOrigin = '';
        string baseUrl = URL.getOrgDomainUrl().toExternalForm();
        // Expected Format = https://domain.my.salesforce.com
        // Expected Format for DE, Sandbox & Production ORgs = domain--c.visualforce.com
        visualOrigin = baseUrl.split('.my.')[0] + '--c.' + 'visualforce.com';
        return visualOrigin;
    }
}
