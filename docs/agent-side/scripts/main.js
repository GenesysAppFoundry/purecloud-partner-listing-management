import agentConfig from './config/config.js';
import test from './test/test.js';
import partnerAccess from './partner-access.js';
import listingInteractionTemplate from './templates/listing-interaction.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
client.setPersistSettings(true, 'listing_management');

// Create API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const architectApi = new platformClient.ArchitectApi();
const integrationsApi = new platformClient.IntegrationsApi();

// Global
let user = {};
let listingRequest = {};

// Authenticate
client.loginImplicitGrant(agentConfig.clientId, window.location.href)
// Login
.then(() => {
    console.log('PureCloud Auth successful.');

    return usersApi.getUsersMe();
})    
// Get User
.then((me) => {
    user = me;

    return notificationsApi.postNotificationsChannels();
})
// Create a subscription channel for incoming interaction
.then((channel) => {
    let topic = `v2.users.${user.id}.conversations.emails`;
    
    let websocket = new WebSocket(channel.connectUri);
    websocket.onmessage = function(message){
        // Parse notification string to a JSON object
        const notification = JSON.parse(message.data);

        // Check if email conversatino related
        if(notification.topicName == topic) {
            // Get participants
            let agent = notification.eventBody
                .participants.find(p => p.purpose == 'agent');
            let customer = notification.eventBody
                .participants.find(p => p.purpose == 'customer');
            if(!agent) return;

            if(agent.state == 'connected'){
                listingRequest = JSON.parse(customer.attributes.listingDetail);
                console.log(listingRequest);
                listingRequestReceived();
            }
        }
    }

    return notificationsApi
        .putNotificationsChannelSubscriptions(channel.id, [
            {
                id: topic
            }
        ]);
})
.then(() => {
    console.log('Subscribed to Email');
    setUp();
})
.catch((e) => {
    console.error(e);
});

function setUp(){    
    // FOR TESTING PURPOSES ONLY
    listingRequest = test;
    listingRequestReceived();
    // END OF TESTING LOGIC

    partnerAccess.setup(client, platformClient);

    return processTemporaryCredentials()
    .then(() => {

        return partnerAccess.getListingDetails(
            'genesys4', 
            'mypurecloud.com', 
            'f6f81425-79fe-4269-b750-e86764411594', 
            '1');
    })
    .then((x) => {
        console.log(x);
    })
    setupButtonHandlers();
}

function listingRequestReceived(){
   let elContainer = document.getElementById('listing-interactions-container');
   elContainer.appendChild(listingInteractionTemplate.new(listingRequest));
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
    let btnApprove = document.getElementById('btn-approve');

    btnApprove.addEventListener('click', function(){
        updateListingStatus(4)
        .then(() => alert('Approved!'));
    });
}

// TODO: use consts for the statuses instead of direct int
function updateListingStatus(status){

}