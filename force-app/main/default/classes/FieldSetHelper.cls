public with sharing class FieldSetHelper {
    @AuraEnabled(cacheable=true)
    public static String getFieldsFromFieldSet(String strObjectApiName, String strfieldSetName) {
        if (!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName)) {
            Map<String, String> returnMap = new Map<String, String>();

            //get fields from FieldSet
            SObject sObj = (SObject) (Type.forName('Schema.' + strObjectApiName)?.newInstance());
            List<Schema.FieldSetMember> lstFSMember = sObj
                ?.getSObjectType()
                ?.getDescribe()
                ?.fieldSets.getMap()
                .get(strfieldSetName)
                ?.getFields();

            returnMap.put('FIELD_LIST', JSON.serialize(lstFSMember));
            returnMap.put('OBJECT_LABEL', sObj?.getSObjectType()?.getDescribe()?.getLabel());

            //working
            List<roFieldSetMember> fieldSetMemberList = new roFieldSetMember().parse(JSON.serialize(lstFSMember));

            for (roFieldSetMember currentItem : fieldSetMemberList) {
                if (currentItem.type == 'picklist') {
                    currentItem.pickListOptions = new List<SelectOption>();
                    currentItem.pickListOptions = getPicklistValues(sObj, currentItem.fieldPath);
                }
            }

            // roFieldSetMember.parse(JSON.serialize(lstFSMember));

            System.debug('FIELD_LIST-->' + fieldSetMemberList);
            System.debug('OBJECT_LABEL-->' + sObj?.getSObjectType()?.getDescribe()?.getLabel());

            return JSON.serialize(returnMap);
        }
        return null;
    }

    private static list<SelectOption> getPicklistValues(SObject obj, String fld) {
        list<SelectOption> options = new List<SelectOption>();
        // Get the object type of the SObject.
        Schema.sObjectType objType = obj.getSObjectType();
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        // Get a map of fields for the SObject
        map<String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        // Get the list of picklist values for this field.
        list<Schema.PicklistEntry> values = fieldMap.get(fld).getDescribe().getPickListValues();
        // Add these values to the selectoption list.
        for (Schema.PicklistEntry a : values) {
            options.add(new SelectOption(a.getLabel(), a.getValue()));
        }
        return options;
    }

    @AuraEnabled(cacheable=true)
    public static String getFieldsAndRecords(
        String strObjectApiName,
        String strfieldSetName,
        String criteriaField,
        String criteriaFieldValue
    ) {
        Map<String, String> returnMap = new Map<String, String>();
        if (!String.isEmpty(strObjectApiName) && !String.isEmpty(strfieldSetName)) {
            //get fields from FieldSet
            SObject sObj = (SObject) (Type.forName('Schema.' + strObjectApiName).newInstance());
            List<Schema.FieldSetMember> lstFSMember = sObj.getSObjectType()
                .getDescribe()
                .fieldSets.getMap()
                .get(strfieldSetName)
                .getFields();

            //prepare SOQL query based on fieldAPIs
            String query = 'SELECT ';
            for (Schema.FieldSetMember f : lstFSMember) {
                query += f.getFieldPath() + ', ';
            }
            query += 'Id FROM ' + strObjectApiName;

            //Just in case criteria field not specified then it will return all records
            if (!(String.isEmpty(criteriaField) && String.isEmpty(criteriaFieldValue))) {
                query += ' WHERE ' + criteriaField + '=\'' + criteriaFieldValue + '\'';
            }

            //execute query
            List<SObject> lstRecords = Database.query(query);

            //prepare a map which will hold fieldList and recordList and return it
            returnMap.put('FIELD_LIST', JSON.serialize(lstFSMember));
            returnMap.put('RECORD_LIST', JSON.serialize(lstRecords));
            return JSON.serialize(returnMap);
        }
        return null;
    }

    public with sharing class roFieldSetMember {
        public Boolean dbRequired { get; set; }
        public String fieldPath { get; set; }
        public String label { get; set; }
        public Boolean required { get; set; }
        public String type { get; set; }
        public String typeApex { get; set; }
        public List<SelectOption> pickListOptions { get; set; }

        public roFieldSetMember() {
            System.debug('roFieldSetMember-->');
            dbRequired = false;
            fieldPath = '';
            label = '';
            required = false;
            type = '';
            typeApex = '';
            pickListOptions = new List<SelectOption>();
        }

        // {"dbRequired":false,"fieldPath":"AccountId","label":"Account ID","required":false,"type":"reference","typeApex":"REFERENCE"

        public List<roFieldSetMember> parse(String json) {
            return (List<roFieldSetMember>) System.JSON.deserialize(json, List<roFieldSetMember>.class);
        }
    }
}
