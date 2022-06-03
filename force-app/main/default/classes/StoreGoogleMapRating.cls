// page controller
global without sharing class StoreGoogleMapRating {
    @RemoteAction
    global static String storeRating(String googleMapPlace, String rating, String comment) {
        System.debug('googleMapPlace-->' + googleMapPlace);
        System.debug('rating-->' + rating);
        System.debug('comment-->' + comment);
        return 'Your rating has been submitted successfully.';
    }

    @RemoteAction
    global static String displayRating(String placeId, List<String> Rating_List) {
        return '';
    }
}
