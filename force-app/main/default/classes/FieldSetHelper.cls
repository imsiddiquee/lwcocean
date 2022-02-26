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
                    currentItem.pickListOptions = new Map<String, String>();
                    currentItem.pickListOptions = getPicklistValuesMap(
                        sObj?.getSObjectType()?.getDescribe()?.getLabel(),
                        currentItem.fieldPath
                    ); //getPicklistValues(sObj, currentItem.fieldPath);
                }
            }

            //"type": "reference"
            Set<String> refIds = new Set<String>();
            Map<String, roFieldSetMember> fieldMemberMap = new Map<String, roFieldSetMember>();

            for (roFieldSetMember currentField : fieldSetMemberList) {
                fieldMemberMap.put(currentField.fieldPath, currentField);
            }

            for (roFieldSetMember currentField : fieldSetMemberList) {
                if (currentField.type == 'reference') {
                    refIds.add(currentField.fieldPath);
                }
            }

            System.debug('refIds-->' + refIds);

            for (FieldDefinition currentDefinition : [
                SELECT QualifiedApiName, DeveloperName
                FROM FieldDefinition
                WHERE EntityDefinition.QualifiedApiName = 'Case' AND QualifiedApiName IN :refIds
            ]) {
                System.debug(currentDefinition.QualifiedApiName);
                if (fieldMemberMap.containsKey(currentDefinition.QualifiedApiName)) {
                    roFieldSetMember obj = fieldMemberMap.get(currentDefinition.QualifiedApiName);
                    System.debug('field-QualifiedApiName-->' + currentDefinition.QualifiedApiName);
                    System.debug('field-DeveloperName-->' + currentDefinition.DeveloperName);
                    obj.targetObjectAPIName = currentDefinition.QualifiedApiName.contains('__c')
                        ? currentDefinition.QualifiedApiName
                        : currentDefinition.DeveloperName;
                }
            }

            // roFieldSetMember.parse(JSON.serialize(lstFSMember));

            System.debug('FIELD_LIST3-->' + fieldSetMemberList);
            System.debug('FIELD_LIST2-->' + JSON.serialize(fieldSetMemberList));
            System.debug('OBJECT_LABEL-->' + sObj?.getSObjectType()?.getDescribe()?.getLabel());

            returnMap.put('FIELD_LIST_data', JSON.serialize(fieldSetMemberList));

            return JSON.serialize(returnMap);
        }
        return null;
    }

    public static Map<String, String> getPicklistValuesMap(String objectAPIName, String fieldAPIName) {
        // * Initializing picklist field map to story value and label of picklist entries
        Map<String, String> picklistFieldMap = new Map<String, String>();

        // * Getting the field result for the current field
        Schema.DescribeFieldResult fieldResult = Schema.getGlobalDescribe()
            .get(objectAPIName)
            .getDescribe()
            .fields.getMap()
            .get(fieldAPIName)
            .getDescribe();

        // * Checking if the field type is a picklist
        if (fieldResult.getType() == Schema.DisplayType.Picklist) {
            // * Getting all picklist entries
            List<Schema.PicklistEntry> picklistEntries = fieldResult.getPicklistValues();

            // * Looping over all picklist entries one by one
            for (Schema.PicklistEntry picklistEntry : picklistEntries) {
                // * If the picklist entry is active, getting the label and value and putting those in map
                if (picklistEntry.isActive()) {
                    String picklistLabel = picklistEntry.getLabel();
                    String picklistValue = picklistEntry.getValue();
                    picklistFieldMap.put(picklistValue, picklistLabel);
                }
            }
        }

        // * Returning the picklist field map
        return picklistFieldMap;
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
        public String targetObjectAPIName { get; set; }
        public String label { get; set; }
        public Boolean required { get; set; }
        public String type { get; set; }
        public String typeApex { get; set; }
        public Map<String, String> pickListOptions { get; set; }

        public roFieldSetMember() {
            System.debug('roFieldSetMember-->');
            dbRequired = false;
            fieldPath = '';
            targetObjectAPIName = '';
            label = '';
            required = false;
            type = '';
            typeApex = '';
            pickListOptions = new Map<String, String>();
        }

        // {"dbRequired":false,"fieldPath":"AccountId","label":"Account ID","required":false,"type":"reference","typeApex":"REFERENCE"

        public List<roFieldSetMember> parse(String json) {
            return (List<roFieldSetMember>) System.JSON.deserialize(json, List<roFieldSetMember>.class);
        }
    }
}
