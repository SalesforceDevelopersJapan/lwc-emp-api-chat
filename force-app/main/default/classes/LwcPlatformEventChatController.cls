public with sharing class LwcPlatformEventChatController {
  @AuraEnabled(cacheable=true)
  public static User getUserData() {
    return [
      SELECT Id, Name, SmallPhotoUrl
      FROM User
      WHERE Id = :UserInfo.getUserId()
    ];
  }

  @AuraEnabled
  public static void publish(
    String userId,
    String userName,
    String messageType,
    String message,
    String profileType,
    String profileValue
  ) {
    List<LWC_Chat__e> events = new List<LWC_Chat__e>();
    events.add(
      new LWC_Chat__e(
        MessageType__c = messageType,
        Message__c = message,
        ChatUserId__c = userId,
        ChatUserName__c = userName,
        ProfileImageValue__c = profileValue,
        ProfileImageType__c = profileType
      )
    );

    // Call method to publish events
    List<Database.SaveResult> results = EventBus.publish(events);

    // Inspect publishing result for each event
    for (Database.SaveResult sr : results) {
      if (sr.isSuccess()) {
        // System.debug('Successfully published event.');
      } else {
        for (Database.Error err : sr.getErrors()) {
          System.debug(
            'Error returned: ' +
            err.getStatusCode() +
            ' - ' +
            err.getMessage()
          );
        }
      }
    }
  }
}
