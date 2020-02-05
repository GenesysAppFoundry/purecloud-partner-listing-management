import modal from '../../components/main.js';
import agentConfig from './config/config.js';
import partnerAccess from './partner-access.js';
import view from './view-listing-review.js';

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

// Global
let user = {};

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

    return verifyInteractionHandling()
    .then((listingAttributes) => {
        return partnerAccess.getListingDetails(
            listingAttributes.org,
            listingAttributes.environment,
            listingAttributes.dataTableId,
            listingAttributes.listingId
        );
    })
    .then((listingInfo) => {
        view.fillAppDetails(listingInfo);
    })
    .catch((e) => console.error(e));
}

function verifyInteractionHandling(){
    return conversationsApi.getConversations()
    .then((result) => {
        let conversations = result.entities;
        console.log(conversations);

        // Get the listing interaction
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
        
        if(!listingInteraction){
            modal.showInfoModal(
                'Hmm',
                'You don\'t have any listing requests assigned to you.',
                () => {
                    window.location.href = agentConfig.redirectUriBase;
                }
            )
        }

        let participants = listingInteraction.participants;
        let agentParticipant = participants.find(p => p.purpose == 'agent');
        let state = agentParticipant.emails[0].state;

        // Make sure that agent actulaly accepted the email interaction
        if(state == 'alerting'){
            modal.showInfoModal(
                'Please Accept',
                'Please answer the interaction before proceeding. \n' +
                'Press Ok after you\'ve accepted',
                () => {
                    location.reload();
                }
            )
        }

        // Promise to block the flow when it's not actually connected
        return new Promise((resolve, reject) => {
            if(state == 'connected'){
                resolve(participants[0].attributes);
            }
        });
    })
}

function setupButtonHandlers(){

}