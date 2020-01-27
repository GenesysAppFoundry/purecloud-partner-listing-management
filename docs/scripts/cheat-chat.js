/**
 * This will hold all the code to manage and run the
 * Chat "API" to the 'agent' org.
 * Explanation:
 * The API "calls" would be requests to initiate a chat conversation with
 * the agent org. The chat deployment will handle logic in the IVR and
 * send "responses" as actual chat responses.
 * Important messages will be prefixed based on intended usage:
 * (prefix):somethin something
 * Prefixes:
 *      listings-info: Will contain the entire lsitings info of that 
 *                      particular region as requested
 *      meta: random messages for testing purposes 
 *                      to know the current state in the IVR
 *      error: errors lilke if data actions in the ivr fail or times-out
 *      success: data action success
 */

import config from '../config/config.js';

let orgName = '';

export default {
    setUp(org){
        orgName = org.thirdPartyOrgName;

        console.log('Cheat Chat Setup');
    },

    queryListingVersions(){
        // Build request Body
        let requestBody = {
            organizationId: config.cheatChat.organizationId,
            deploymentId: config.cheatChat.deploymentId,
            memberInfo: { 
                displayName: orgName,
                customFields: {
                    purpose: 'version',
                    org: orgName,
                    // TODO: Get regions via Client App SDK
                    environment: 'com'
                }
            }
        }

        return new Promise((resolve, reject) => {
             // Send request
            $.ajax({
                url: 'https://api.mypurecloud.com/api/v2/webchat/guest/conversations',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache"
                },
                data: JSON.stringify(requestBody)
            })
            .done((x) => {
                let websocket = new WebSocket(x.eventStreamUri)
                websocket.onmessage = function(event){
                    let data = JSON.parse(event.data);

                    let eventBody = data.eventBody;
                    let body = eventBody.body;
                    if(body){
                        console.log(body);
                        if(body.startsWith('listings-info:')){
                            let res = body.substring(body.search(':') + 1);
                            resolve(res);
                        }
                    }
                    if(eventBody.bodyType == 'member-leave'){
                        console.log('CHEAT CHAT DONE');
                    }
                };
                console.log('Sent Cheat Chat Request');
            })
            .fail((e) => reject(e));
        })
    },

    submitListing(dtRow, orgName){
        const appName = JSON.parse(dtRow.listingDetails).name;

        // Build the custom field body
        let customField = {
            id: dtRow.key,
            orgName: orgName,
            // TODO: Actually determine environment
            environment: 'mypurecloud.com'
        }
        customField.listingDetails = JSON.parse(dtRow.listingDetails);
        customField.premiumAppDetails = JSON.parse(dtRow.premiumAppDetails);
        customField.attachments = JSON.parse(dtRow.attachments);
        
        let customFieldString = JSON.stringify(customField);

        // Divide the long info into parts
        const cutSize = 999;
        let customFieldStringArr = [];
        let numOfSections = Math.ceil(customFieldString.length / cutSize);
        for(let i = 0; i < numOfSections; i++){
            let str = customFieldString.substr(i * (cutSize - 1), cutSize);
            customFieldStringArr.push(str);
        }

        // Template
        let requestBody = {
            organizationId: config.cheatChat.organizationId,
            deploymentId: config.cheatChat.deploymentId,
            memberInfo: { 
                displayName: orgName + ' - ' + appName,
                customFields: {
                    purpose: 'submit'
                }
            }
        }

        // Add the parts as custom fields
        customFieldStringArr.forEach((part, i) => {
            requestBody.memberInfo
            .customFields[`listingDetails_${i + 1}`] = part;
        })

        console.log(requestBody);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://api.mypurecloud.com/api/v2/webchat/guest/conversations',
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache"
                },
                data: JSON.stringify(requestBody)
            })
            .done((x) => {
                let websocket = new WebSocket(x.eventStreamUri)
                websocket.onmessage = function(event){
                    let data = JSON.parse(event.data);
                    //console.log(data);
                    let eventBody = data.eventBody;
                    if(eventBody.body){
                        console.log(eventBody.body);

                        if(eventBody.body.startsWith('success:')){
                            resolve();
                        }
                    }
                    if(eventBody.bodyType == 'member-leave'){
                        console.log('DONE');
                    }
                };
                console.log('sent');
            })
            .fail((e) => reject(e));
        })
    }
}