public with sharing class JsonParser {
    public String next_page { get; set; }
    public String previous_page { get; set; }
    public Integer count { get; set; }
    public list<tickets> tickets { get; set; }
    public class tickets {
        public Decimal group_id { get; set; }
        public list<String> follower_ids { get; set; }
        public list<String> collaborator_ids { get; set; }
        public list<String> email_cc_ids { get; set; }
        public String organization_id { get; set; }
        public String forum_topic_id { get; set; }
        public Decimal assignee_id { get; set; }
        public String problem_id { get; set; }
        public Decimal submitter_id { get; set; }
        public Boolean has_incidents { get; set; }
        public Decimal requester_id { get; set; }
        public Boolean is_public { get; set; }
        public String recipient { get; set; }
        public String due_at { get; set; }
        public String status { get; set; }
        public list<String> tags { get; set; }
        public String priority { get; set; }
        public list<String> custom_fields { get; set; }
        public String description { get; set; }
        public String satisfaction_rating { get; set; }
        public String raw_subject { get; set; }
        public list<String> sharing_agreement_ids { get; set; }
        public String subject { get; set; }
        public list<String> fields { get; set; }
        public String type { get; set; }
        public list<String> followup_ids { get; set; }
        public String updated_at { get; set; }
        public Decimal ticket_form_id { get; set; }
        public String created_at { get; set; }
        public Decimal brand_id { get; set; }
        public Boolean allow_channelback { get; set; }
        public String external_id { get; set; }
        public Integer id { get; set; }
        public Boolean allow_attachments { get; set; }
        public String url { get; set; }
    }
}
