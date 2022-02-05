public with sharing class zendesktickets {
    public static void getTickets() {
        String username = 'imsiddiquee@gmail.com';
        String pword = 'Tigerhunter1';
        Blob headerValue = Blob.valueOf(username + ':' + pword);
        String authorizationHeader = 'BASIC ' + EncodingUtil.base64Encode(headerValue);

        HttpRequest req = new HttpRequest();
        // req.setEndpoint('callout:practice7409/api/v2/tickets.json');
        req.setHeader('Authorization', authorizationHeader);
        req.setEndpoint('https://practice7409.zendesk.com/api/v2/tickets.json');

        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        system.debug('getBody-->' + res.getBody());
        JsonParser allTickets = (JsonParser) JSON.deserialize(res.getBody(), JsonParser.class);
        list<case> allCase = new List<case>();
        for (JsonParser.tickets t : allTickets.tickets) {
            case c = new case();
            c.Status = t.status;
            c.Subject = t.subject;
            c.Description = t.description;
            c.Origin = 'Phone';
            allCase.add(c);
        }
        System.debug('allCase-->' + allCase);
        //upsert allCase;
    }

    @auraEnabled
    public static String getCases() {
        String username = 'imsiddiquee@gmail.com';
        String pword = 'Tigerhunter1';
        Blob headerValue = Blob.valueOf(username + ':' + pword);
        String authorizationHeader = 'BASIC ' + EncodingUtil.base64Encode(headerValue);
        HttpRequest req = new HttpRequest();
        req.setHeader('Authorization', authorizationHeader);
        req.setEndpoint('https://practice7409.zendesk.com/api/v2/tickets.json');
        //req.setBody(jsonBody);
        req.setMethod('GET');
        Http http = new Http();
        HTTPResponse res = http.send(req);
        if (res.getStatusCode() == 401)
            return 'Invalid Creds';
        system.debug('getBody-->' + res.getBody());
        return res.getBody();
    }
}
