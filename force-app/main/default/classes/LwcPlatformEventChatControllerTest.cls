@IsTest
private class LwcPlatformEventChatControllerTest {
    @IsTest
    private static void getUserDataTest() {
        User u = LwcPlatformEventChatController.getUserData();
    }

    @IsTest
    private static void publishTest() {
        LwcPlatformEventChatController.publish(
            'AAA', 'BBB', 'comment', 'DDD', 'color', 'blue'
        );
    }
}
