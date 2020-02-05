import modal from '../../components/main.js';
import agentConfig from './config/config.js';
import partnerAccess from './partner-access.js';
import view from './view.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
client.setPersistSettings(true, 'listing_management');

// Create API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const architectApi = new platformClient.ArchitectApi();
const analyticsApi = new platformClient.AnalyticsApi();
const conversationsApi = new platformClient.ConversationsApi();

// Constants
const queueTopic = `v2.routing.queues.${agentConfig.queueId}.conversations.emails`;

// Global
let user = {};
let listingRequest = {};


// Authenticate
client.loginImplicitGrant(agentConfig.clientId, window.location.href)
// Login
.then(() => {
    modal.setup();
    console.log('PureCloud Auth successful.');

    modal.showLoader('Setting you up');
    return usersApi.getUsersMe();
})    
// Get User
.then((me) => {
    user = me;

    return setUp();
})
.then(() => {
    modal.hideLoader();
})
.catch((e) => {
    console.error(e);
});

function setUp(){    
    partnerAccess.setup(client, platformClient, user);

    return setupNotifications()
    .then(() => {
        console.log('Notifications successfully setup');

        return processTemporaryCredentials();
    })
    .then(() => {
        return refreshInteractionsList();
    })
    .then(() => {
        return checkExistingAssignedListing();
    })
    .then(() => {
        setupButtonHandlers();
    })
    .catch(e => console.error(e));
}


/**
 * From conversation object serialize to one that also include the actual
 * lsiting details from the partner org.
 * Technically not only serializatino but also gets the actual data.
 * @param {Conversation} conversation 3rd party interaction
 * @returns {Promise} serialized data  
 */
function serializeConversationDetails(conversation){
    console.log(conversation);

    return new Promise((resolve, reject) => {
        // Build the template for the serialzed data
        let serializedData = {
            conversationId: conversation.id,
            lastParticipant: conversation.participants
                        [conversation.participants.length - 1],
            listingData: null
        }
    
        // Get the aprticipant data from the interaction
        // and use to query the actual listing from partner org
        let payload = conversation.participants[0]
                        .attributes;
        partnerAccess.getListingDetails(
                payload.org, 
                payload.environment, 
                payload.dataTableId, 
                payload.listingId)
        .then((listingData) => {
            serializedData.listingData = listingData;

            resolve(serializedData);
        })
        .catch(e => reject(e));
    });
}

/**
 * Get interactions in the queue to display
 */
function refreshInteractionsList(){
    view.showListingLoader('Gathering Listing Requests...');
    view.hideBlankInteractionsMsg();

    return getQueueInteractions(agentConfig.queueId)
    .then((result) => {        
        console.log(result);
        let convPromises = [];
        if(!result.conversations) return;

        // Scroll through analytics results and call getconversation
        // on each to get the attributes then serialize it
        // to finally get the details from partner-side.
        result.conversations.forEach(c => {
            let participants = c.participants;
            if(participants[participants.length - 1].purpose != 'acd') return;

            convPromises.push(
                conversationsApi.getConversation(c.conversationId)
                .then((fullConvo) => {
                    return serializeConversationDetails(fullConvo);
                })
                .catch(e => console.error(e))
            );
        });

        return Promise.all(convPromises);
    })
    .then((serializedArr) => {
        view.clearEmailContainer();
        view.hideListingLoader();

        if(!serializedArr || serializedArr.length <= 0){
            view.showBlankInteractionsMsg();
        }else{
            serializedArr.forEach(
                (listingData) => view.addInteractionBox(listingData, assignToAgent));
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

/**
 * Get emails from queue
 * @param {String} queueId PureCloud Queue ID
 * @returns {Promise} the api response
 */
function getQueueInteractions(queueId){
    let intervalTo = moment().utc().add(1, 'h');
    let intervalFrom = intervalTo.clone().subtract(7, 'days');
    let intervalString = intervalFrom.format() + '/' + intervalTo.format();
    
    let queryBody = {
        'interval': intervalString,
        'order': 'asc',
        'orderBy': 'conversationStart',
        'paging': {
            'pageSize': '100',
            'pageNumber': 1
        },
        'segmentFilters': [
            {
                'type': 'and',
                'predicates': [
                    {
                        'type': 'dimension',
                        'dimension': 'mediaType',
                        'operator': 'matches',
                        'value': 'email'
                    },
                    {
                        'type': 'dimension',
                        'dimension': 'queueId',
                        'operator': 'matches',
                        'value': queueId
                    }
                ]
            }
        ],
        'conversationFilters': [
            {
                'type': 'or',
                'predicates': [
                    {
                        'type': 'dimension',
                        'dimension': 'conversationEnd',
                        'operator': 'notExists',
                        'value': null
                    }
                ]
            }
        ]
    };

    return analyticsApi.postAnalyticsConversationsDetailsQuery(queryBody);
}

/**
 * Debounce Workaround. Ok so in order to avoid duplicating istings on arrival
 * we'll keep track of rcent conversations to be processed. Due to async.
 * of processing the data, we can't reliably check duplication based on 
 * whether an interaction box is already displayed or not. 
 */
let recentIds = [];
/**
 * Callback when any email notification happens on the queue
 * @param {Object} message the event
 */
function onQueueEmailNotification(message){
    // Parse notification string to a JSON object
    const notification = JSON.parse(message.data);
    const eventBody = notification.eventBody;

    console.log(notification);
    const participants = eventBody.participants;
    const lastParticipant = participants[participants.length - 1];

    // If new email message add to listing
    if(lastParticipant.purpose == 'acd'
            && lastParticipant.state == 'connected'){
        if(!recentIds.includes(eventBody.id)){
            // Debounce
            recentIds.push(eventBody.id);
            setTimeout(() => {
                recentIds = recentIds.filter(id => eventBody.id != id);
            }, 3000);

            serializeConversationDetails(eventBody)
            .then((serializedData) => {
                view.addInteractionBox(serializedData, assignToAgent);
            })
            .catch(e => console.error(e));
        }
    }
}


function onUserEmailNotification(message){
    // Parse notification string to a JSON object
    const notification = JSON.parse(message.data);
    const eventBody = notification.eventBody;

    checkExistingAssignedListing();
}

/**
 * Check if agent already has an alerting or connected listing interactoin
 * to handle
 * @returns {Promise} the conversation, undefined if none
 */
function checkExistingAssignedListing(){
    return conversationsApi.getConversations()
    .then((result) => {
        let conversations = result.entities;
        console.log(conversations);

        let listingInteraction = conversations.find((conversation) => {
            try{
                let participants = conversation.participants;
                if(participants[0].purpose == 'customer' &&
                        participants[0].attributes.listingId){
                    return true;
                }
            }catch(e){
                console.error(e);
                return false;
            }
        });
        
        return listingInteraction;
    })
    .then((conversation) => {
        if(conversation){
            modal.showInfoModal(
                'One at a Time',
                'It seems you have an ongoing listing request to process. \n' +
                'Press ok to review all the details.',
                () => {
                    window.location.href = agentConfig.redirectUriBase 
                                            + 'listing-review.html';
                }
            );
        }
    })
    .catch((e) => console.error(e));
}

/**
 * Assign the listing interaction to the the user agent
 * @param {Object} serializedData result of the serialization function
 */
function assignToAgent(serializedData){
    let conversationId = serializedData.conversationId;
    let lastParticipant = serializedData.lastParticipant;

    if(lastParticipant.purpose != 'acd'){
        modal.showInfoModal(
            'Oops',
            'That interaction is no longer available. \n' + 
            'Another person has already accepted this task.',
            () => modal.hideInfoModal()
        );
    }else{
        modal.showLoader('Assigning Email...');

        let body = {
            'userId': user.id,
        };
        conversationsApi.postConversationParticipantReplace(conversationId, 
            lastParticipant.id, body)
        .then(() => {

            view.hideInteractionBox(conversationId);
            modal.hideLoader();
        })
        .catch((err) => {
            console.log(err);
        });
    }    
}

/**
 * Creation of channels for PureLCoud Notifications on queue and user
 */
function setupNotifications(){
    let userTopic = `v2.users.${user.id}.conversations.emails`;

    return notificationsApi.postNotificationsChannels()
    // Create a subscription channel for incoming interaction
    // to the queue
    .then((channel) => {    
        let websocket = new WebSocket(channel.connectUri);
        websocket.onmessage = function(message){
            // Parse notification string to a JSON object
            const notification = JSON.parse(message.data);
            console.log(notification);
            switch(notification.topicName){
                case queueTopic:
                    onQueueEmailNotification(message)
                    break;
                case userTopic:
                    onUserEmailNotification(message)
                    break;
                default:
                    break;
            }
        };

        return notificationsApi
            .putNotificationsChannelSubscriptions(channel.id, [
                {
                    id: queueTopic
                },
                {
                    id: userTopic
                }
            ]);
    })
    .catch(e => console.error(e));
}

/**
 * Partner credentials are saved initially in their own separate row
 * in the Data Table because of DataTable/DataAction limitation reasons. 
 * Every time the agent side app starts,it needs to process them and integrate
 * into the data table cells.
 * @returns {Promise}
 */
function processTemporaryCredentials(){
    let tempCreds = [];
    let tempCredCount = 0;

    return architectApi.getFlowsDatatableRows(agentConfig.dataTableId, {
        pageSize: 500,
        showbrief: false
    })
    .then((results) => {
        let processingPromises = [];

        tempCreds = results.entities.filter((row) => {
            return row.key.startsWith('temp_');
        });

        // Process the temporary credentials
        tempCreds.forEach((cred) => {
            console.log(cred);
            let credEnv = ''; // eg mypurecloud.com
            let credKey = cred.key.substring(5);

            let process = new Promise((resolve, reject) => {
                // Get the temp row
                architectApi.getFlowsDatatableRow(
                    agentConfig.dataTableId, 
                    cred.key, 
                    { showbrief: false })
                .then((row) => {
                    // Determine environment that has credentials
                    credEnv = Object.keys(row).find(key => {
                        return key.startsWith('mypurecloud') &&
                        row[key] != "{}";
                    });

                    return architectApi.getFlowsDatatableRow(
                        agentConfig.dataTableId, 
                        credKey[0], 
                        { showbrief: false })
                })
                // Get the row that the creds will be insterted to
                .then((row) => {
                    // Rebuild the cell with the new values
                    let cellObject = JSON.parse(row[credEnv]);
                    cellObject[credKey] = JSON.parse(cred[credEnv]);
                    row[credEnv] = JSON.stringify(cellObject);

                    return architectApi.putFlowsDatatableRow(
                        agentConfig.dataTableId, 
                        row.key,
                        { body: row }
                    )
                })
                // Delete the temp row
                .then(() => {
                    return architectApi.deleteFlowsDatatableRow(
                        agentConfig.dataTableId, 
                        cred.key
                    )
                })
                .then(() => {
                    console.log('Processed temp for ' + credKey);
                    tempCredCount++;
                    resolve();
                })
                .catch((e) => reject(e));
            });

            processingPromises.push(process);
        })

        return Promise.all(processingPromises);
    })
    .then(() => {
        console.log('Finished processing all temporary credentials ' 
                    + tempCredCount);
    })
    .catch(e => console.error(e));
}



function setupButtonHandlers(){
    document.getElementById('btn-refresh-interactions')
            .addEventListener('click', function(){
                refreshInteractionsList();
            });
}