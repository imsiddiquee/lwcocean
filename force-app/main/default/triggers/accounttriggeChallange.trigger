
/**
 * To make thing simple I am not going to use the handler.
 */

trigger accounttriggeChallange on Account ( before insert,
after insert,
before update,
after update,
before delete,
after undelete,
after delete) {


    List<String> industries = new List<String>{'A','B','C'};

    //Restrict invalid industry on insert and update
    if(trigger.isBefore && (trigger.isInsert || trigger.isUpdate))
    {
        for(account x : trigger.newMap.values()){

            if(industries.contains(x.Industry))
            {
                x.addError('INVALID INDUSTRY');
                return;
            }
           
        }
    }

    //check record has updated and concatenate string.
    if(trigger.isBefore && trigger.isUpdate)
    {        

        for(account x : trigger.newMap.values()){           

            if (x.name != trigger.oldmap.get(x.id).name) {
                x.name = x.name + ' - Updated';
            }
            if (x.AnnualRevenue > 1000){
                x.Rating = 'Hot';
            }
        }
    } 
}