public with sharing class SchemaController {
  @AuraEnabled(cacheable=true)
  public static List<SelectOption> getSobjectList() {
    List<SelectOption> sobjectsList  = new List<SelectOption>();
    sobjectsList.add(new SelectOption('-',''));
    for(Schema.SObjectType sobjectType : Schema.getGlobalDescribe().values()) {
      Schema.DescribeSObjectResult describeSobjectResult = sobjectType.getDescribe();
    for(Schema.SObjectField objectField : describeSobjectResult.fields.getMap().values()) {
        if(objectField.getDescribe().getName() == 'Name' && describeSobjectResult.isUpdateable()) {
          sobjectsList.add(new SelectOption(describeSobjectResult.getName(), describeSobjectResult.getLabel()));
        }
      }
    }
    return sobjectsList;
  }

  public static List<String> getObjectFields(String objectName) {
    List<String> fieldsNameList = new List<String>();
    Map <String, Schema.SObjectType> schemaMap = Schema.getGlobalDescribe();
    Map <String, Schema.SObjectField> fieldMap = schemaMap.get(objectName).getDescribe().fields.getMap();
    for(Schema.SObjectField sfield : fieldMap.Values())
    {
      Schema.DescribeFieldResult  sfieldDesc = sfield.getDescribe();
      if(sfieldDesc.isUpdateable()) {
        fieldsNameList.add(sfield.getDescribe().getName());
      }
    }
    return fieldsNameList;
  }
  public class SelectOption {
  @AuraEnabled
  public String value;
  @AuraEnabled
  public String label;
    public SelectOption(String value, String label) {
      this.value = value;
      this.label = label;
    }
  }
}
