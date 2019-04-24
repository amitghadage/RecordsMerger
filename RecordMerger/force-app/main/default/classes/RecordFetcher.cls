public with sharing class RecordFetcher {
  @AuraEnabled
  public static List<Object> getRecords(String searchFor, String objectName) {
    String queryString = 'SELECT ';
    for(String fieldName : SchemaController.getObjectFields(objectName)) {
      queryString += fieldName + ', ';
    }
    queryString = queryString.substringBeforeLast(',');
    queryString += ' FROM ' + String.escapeSingleQuotes(objectName) + ' WHERE Name Like \'%' + String.escapeSingleQuotes(searchFor) + '%\'';
    System.debug('QueryString : '+queryString);
    return Database.query(queryString);
  }

  @AuraEnabled
  public static void mergeRecords(sObject obj, Id deleteRecordId){
    update obj;
    String sObjName = deleteRecordId.getSObjectType().getDescribe().getName();
    String queryString = 'SELECT Id FROM ' + sObjName + ' WHERE Id = \''+deleteRecordId +'\'';
    delete Database.query(queryString);
  }
}
