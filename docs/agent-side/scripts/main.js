import agentConfig from './config.js';

//Load purecloud and create the ApiClient Instance
const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
client.setPersistSettings(true, 'listing_management');

// Create API instances
const usersApi = new platformClient.UsersApi();
const notificationsApi = new platformClient.NotificationsApi();
const architectApi = new platformClient.ArchitectApi();

// Global
let user = {};
let listingRequest = {};

// Authenticate
client.loginImplicitGrant(agentConfig.clientId, window.location.href)
.then(() => {
    console.log('PureCloud Auth successful.');

    return usersApi.getUsersMe();
})    
.then((me) => {
    user = me;

    return notificationsApi.postNotificationsChannels();
})
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
    // TODO: move to view
    let elListingInfo = document.getElementById('listing-info');
    let elListingName = document.getElementById('listing-name');

    elListingInfo.style.visibility = 'hidden';

    setupButtonHandlers();
}

function listingRequestReceived(){
    return updateListingStatus(2)
    .then(() => {
        console.log('Update dt');

        // TODO: view
        let elListingInfo = document.getElementById('listing-info');
        let elListingName = document.getElementById('listing-name');
        let jsonDump = document.getElementById('json-dump');
        

        elListingInfo.style.visibility = 'visible';
        elListingName.innerText = listingRequest.listingDetails.name;
        jsonDump.value = JSON.stringify(listingRequest.listingDetails)
                        + '\n\n\n' 
                        + JSON.stringify(listingRequest.attachments);
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
    let environment = listingRequest.environment;
    let orgName = listingRequest.orgName;
    let listingId = listingRequest.id;
    let rowKey = orgName[0].toLowerCase()

    return architectApi.getFlowsDatatableRow(
        agentConfig.dataTableId, rowKey, {showbrief: false})
    .then((row) => {
        let regionalData = JSON.parse(row[environment]);

        // Create org if doesn't exist yet
        if(!regionalData[orgName]){
            regionalData[orgName] = {};
        }

        // Get orgdata
        let orgData = regionalData[orgName];

        // Set status to pending approval
        orgData[listingId] = status;

        row[environment] = JSON.stringify(regionalData);

        return architectApi.putFlowsDatatableRow(
            agentConfig.dataTableId, rowKey, {
                body: row
            })
    })
}